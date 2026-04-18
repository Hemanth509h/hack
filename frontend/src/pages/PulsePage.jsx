import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useGetSocialFeedQuery, 
  useCreatePostMutation, 
  useLikePostMutation,
  useAddCommentMutation 
} from '../services/socialApi';
import { 
  MessageSquare, Heart, Share2, Send, Plus, 
  Image, Sparkles, Flame
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';

const PostCard = ({ post }: { post: any }) => {
  const [likePost] = useLikePostMutation();
  const [addComment] = useAddCommentMutation();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-[2.5rem] p-8 mb-8 border-black/5 dark:border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.3)] group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16" />
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-gray-900 dark:text-white font-black shadow-lg">
          {post.author.name.charAt(0)}
        </div>
        <div>
          <h4 className="text-gray-900 dark:text-white font-black tracking-tight">{post.author.name}</h4>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{post.author.major || 'Global Citizen'}</p>
        </div>
        <div className="ml-auto">
          <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8 font-light relative z-10">
        {post.content}
      </p>

      {post.attachments?.length > 0 && (
        <div className="rounded-[2rem] overflow-hidden mb-8 border border-black/5 dark:border-white/5 shadow-2xl">
          <img src={post.attachments[0]} alt="Post attachment" className="w-full h-auto object-cover" />
        </div>
      )}

      <div className="flex items-center gap-8 pt-6 border-t border-black/5 dark:border-white/5 relative z-10">
        <button 
          onClick={() => likePost(post._id)}
          className="flex items-center gap-2 group/btn"
        >
          <div className="p-3 rounded-xl glass bg-black/5 dark:bg-white/5 group-hover/btn:bg-pink-500/20 transition-all">
            <Heart className={`w-5 h-5 ${post.likes.length > 0 ? 'fill-pink-500 text-pink-500' : 'text-gray-500 group-hover/btn:text-pink-400'}`} />
          </div>
          <span className="text-xs font-black text-gray-500 group-hover/btn:text-pink-400">{post.likes.length}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 group/btn"
        >
          <div className="p-3 rounded-xl glass bg-black/5 dark:bg-white/5 group-hover/btn:bg-indigo-500/20 transition-all">
            <MessageSquare className="w-5 h-5 text-gray-500 group-hover/btn:text-indigo-400" />
          </div>
          <span className="text-xs font-black text-gray-500 group-hover/btn:text-indigo-400">{post.comments.length}</span>
        </button>

        <button className="flex items-center gap-2 group/btn ml-auto">
          <div className="p-3 rounded-xl glass bg-black/5 dark:bg-white/5 group-hover/btn:bg-white/10 transition-all">
            <Share2 className="w-5 h-5 text-gray-500 group-hover/btn:text-gray-900 dark:text-white" />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 overflow-hidden"
          >
            <div className="space-y-6 mb-8">
              {post.comments.map((comment, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-[10px] font-black text-indigo-400">
                    {comment.author.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black text-gray-900 dark:text-white">{comment.author.name}</span>
                      <span className="text-[8px] text-gray-600 font-black uppercase">{new Date(comment.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <input 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Synchronize your thoughts..."
                className="w-full glass bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500/50"
              />
              <button 
                onClick={() => {
                  if (commentText) {
                    addComment({ id: post._id, content: commentText });
                    setCommentText('');
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-indigo-500 hover:text-indigo-400 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PulsePage = () => {
  const { data: feed, isLoading } = useGetSocialFeedQuery();
  const [createPost] = useCreatePostMutation();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    setIsPosting(true);
    await createPost({ content });
    setContent('');
    setIsPosting(false);
  };

  return (
    <PageContainer className="pb-32 pt-10">
      <div className="max-w-4xl mx-auto">
        {/* Pulse Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8 px-4">
          <div className="text-center md:text-left">
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-4 py-1.5 mb-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                Real-time Campus Sync
              </motion.div>
             <h1 className="text-6xl md:text-8xl font-display font-black text-gray-900 dark:text-white mb-4 tracking-tighter leading-[0.85]">
               Social <br />
               <span className="text-gradient">Pulse.</span>
             </h1>
             <p className="text-gray-500 font-medium text-xl max-w-xl leading-relaxed">Broadcast your experience. Connect with the campus heartbeat.</p>
          </div>
          
          <div className="flex flex-col gap-4">
             <div className="glass bg-black/5 dark:bg-white/5 px-8 py-4 rounded-[2rem] border-black/5 dark:border-white/5 flex items-center gap-4">
                <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                <span className="text-gray-900 dark:text-white font-black text-xs uppercase tracking-widest">Trending Now</span>
             </div>
          </div>
        </div>

        {/* Composer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[3rem] p-8 md:p-12 mb-20 border-black/10 dark:border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex gap-6">
            <div className="w-14 h-14 rounded-[1.5rem] premium-gradient shadow-xl flex items-center justify-center text-gray-900 dark:text-white font-black text-xl">
              Q
            </div>
            <div className="flex-1">
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening in your quadrant?"
                className="w-full bg-transparent border-none text-2xl text-gray-900 dark:text-white font-light placeholder:text-gray-700 focus:ring-0 resize-none min-h-[120px]"
              />
              
              <div className="flex items-center justify-between pt-8 mt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex gap-4">
                  <button className="p-4 rounded-2xl glass bg-black/5 dark:bg-white/5 text-gray-500 hover:text-indigo-400 hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                    <ImageIcon className="w-6 h-6" />
                  </button>
                  <button className="p-4 rounded-2xl glass bg-black/5 dark:bg-white/5 text-gray-500 hover:text-indigo-400 hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                    <Sparkles className="w-6 h-6" />
                  </button>
                </div>
                
                <button 
                  onClick={handlePost}
                  disabled={!content.trim() || isPosting}
                  className="btn-primary px-12 py-5 rounded-2xl shadow-indigo-500/30 text-xs font-black uppercase tracking-widest flex items-center gap-3"
                >
                  {isPosting ? 'Synchronizing...' : (
                    <>
                      Broadcast <Plus className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feed Grid */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center py-20 space-y-6">
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Intercepting Campus Signals...</p>
            </div>
          ) : (
            feed?.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default PulsePage;
