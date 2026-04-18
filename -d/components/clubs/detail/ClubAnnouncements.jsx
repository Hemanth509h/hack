import React from "react";
import { Bell, Clock, MoreVertical, MessageSquare } from "lucide-react";

// Fixed mock data for now, ideally this would be fetched
const MOCK_ANNOUNCEMENTS = [
  {
    id: "1",
    author: "President Sarah",
    content:
      "Hey everyone! Don't forget our general body meeting this Thursday at 6 PM in Hall A. We'll be discussing the upcoming hackathon!",
    date: "2 hours ago",
  },
  {
    id: "2",
    author: "Board Member Alex",
    content:
      "The registration link for the Spring workshop is now live. Be sure to sign up before Friday!",
    date: "Yesterday",
  },
];

export const ClubAnnouncements = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="h-6 w-6 text-indigo-400" />
          Recent Announcements
        </h2>
      </div>

      <div className="space-y-4">
        {MOCK_ANNOUNCEMENTS.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-all relative group"
          >
            <button className="absolute right-4 top-4 text-gray-500 hover:text-gray-900 dark:text-white transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
            <div className="flex items-start gap-4 mb-4">
              <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-gray-900 dark:text-white text-sm">
                {announcement.author.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                  {announcement.author}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <Clock className="h-3 w-3" />
                  {announcement.date}
                </div>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
              {announcement.content}
            </p>
            <div className="flex items-center gap-4 border-t border-gray-200 dark:border-gray-800 pt-4">
              <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-indigo-400 transition-colors">
                <MessageSquare className="h-4 w-4" />
                Reply
              </button>
            </div>
          </div>
        ))}
        {MOCK_ANNOUNCEMENTS.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-600 dark:text-gray-400">
            No announcements yet.
          </div>
        )}
      </div>
    </div>
  );
};
