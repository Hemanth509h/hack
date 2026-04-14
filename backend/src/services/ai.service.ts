import OpenAI from 'openai';
import { ChatSession, ChatMessage } from '../models/ChatSession';
import mongoose from 'mongoose';
import * as aiFunctions from './ai.functions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are Nexus, the official AI assistant for The Quad (a college event and club management platform). 
Your personality is helpful, concise, and energetic.
You help students find events, clubs, campus information (like dining hours or academic calendar), and manage their campus life.
If a user asks about something outside of The Quad or the university, politely inform them that you only possess knowledge about campus activities and information.
Always format event dates and times in a human-readable format.
When suggesting events or clubs, provide brief, punchy descriptions rather than long paragraphs.`;

const TOOLS: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_events",
      description: "Search for upcoming campus events based on query, category, or timeframe.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search terms like 'hackathon' or 'career fair'" },
          category: { type: "string", description: "Event category" },
          timeframe: { type: "string", enum: ["today", "week", "month"], description: "When the event is happening" }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "find_clubs",
      description: "Search for campus clubs by name or interests.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Club topic or name, e.g., 'robotics' or 'chess'" }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_campus_info",
      description: "Retrieve general campus information like dining hall hours, academic calendar dates, or FAQs.",
      parameters: {
        type: "object",
        properties: {
          topic: { type: "string", description: "What the user wants to know, e.g., 'dining hours', 'spring break'" }
        },
        required: ["topic"]
      }
    }
  }
];

export const processChatMessage = async (userId: string, userMessage: string, res: any) => {
  try {
    // 1. Retrieve or Create Session
    let session = await ChatSession.findOne({ userId });
    if (!session) {
      session = await ChatSession.create({
        userId,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }]
      });
    }

    // 2. Append User Message
    session.messages.push({ role: 'user', content: userMessage });
    // Keep context window manageable (System Prompt + last 10 interactions)
    if (session.messages.length > 21) {
       session.messages = [session.messages[0], ...session.messages.slice(-20)];
    }

    await session.save();

    // 3. Initial OpenAI Call
    let response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: session.messages as any[], // Casting as OpenAI types don't perfectly align with mongoose schema
      tools: TOOLS,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;

    // 4. Handle Function Calls
    if (responseMessage.tool_calls) {
      // Append assistant's function call intent to history
      session.messages.push({
        role: 'assistant',
        content: responseMessage.content || '',
        tool_calls: responseMessage.tool_calls
      });

      // Execute all called tools concurrently
      for (const toolCall of responseMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        let functionResponse;

        if (functionName === 'search_events') {
          functionResponse = await aiFunctions.searchEvents(functionArgs);
        } else if (functionName === 'find_clubs') {
          functionResponse = await aiFunctions.findClubs(functionArgs);
        } else if (functionName === 'get_campus_info') {
          functionResponse = await aiFunctions.getCampusInfo(functionArgs);
        }

        session.messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          name: functionName,
          content: JSON.stringify(functionResponse)
        });
      }

      // 5. Second OpenAI Call with tool results
      // We use streaming here for the final response to the user
      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: session.messages as any[],
        stream: true,
      });

      let fullContent = "";
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullContent += content;
        res.write(content); // Stream to client
      }

      // Save final assistant response
      session.messages.push({ role: 'assistant', content: fullContent });
      await session.save();
      res.end();

    } else {
      // Direct response (no tools needed)
      // We stream this directly as well for consistency
      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: session.messages as any[],
        stream: true,
      });

      let fullContent = "";
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullContent += content;
        res.write(content); 
      }

      session.messages.push({ role: 'assistant', content: fullContent });
      await session.save();
      res.end();
    }

  } catch (error) {
    console.error("[ai-service] Error processing chat:", error);
    res.status(500).write("I'm experiencing some technical difficulties connecting to my campus network. Please try again later.");
    res.end();
  }
};
