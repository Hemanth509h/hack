import React, { useState } from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import cn from 'clsx';

export const EventHistory: React.FC<{ events?: any[] }> = ({ events }) => {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  if (!events || events.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/50">
        <Calendar className="w-8 h-8 text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500">No events RSVPa'd yet.</p>
      </div>
    );
  }

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.event.startDate) >= now);
  const pastEvents = events.filter(e => new Date(e.event.startDate) < now);

  const displayList = tab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/40 overflow-hidden shadow-sm">
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setTab('upcoming')}
          className={cn("flex-1 py-3 text-sm font-medium transition-colors border-b-2 cursor-pointer",
            tab === 'upcoming' ? "border-primary-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50" : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:bg-gray-800/30"
          )}
        >
          Upcoming ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setTab('past')}
          className={cn("flex-1 py-3 text-sm font-medium transition-colors border-b-2 cursor-pointer",
            tab === 'past' ? "border-primary-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50" : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:bg-gray-800/30"
          )}
        >
          Past ({pastEvents.length})
        </button>
      </div>

      <div className="p-4">
        {displayList.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-sm">
             No {tab} events found.
          </div>
        ) : (
          <div className="space-y-3">
            {displayList.map(e => (
              <Link 
                key={e.event._id}
                to={`/events/${e.event._id}`}
                className="block p-4 bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-700 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-semibold group-hover:text-primary-400 transition-colors">{e.event.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-2">
                       <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {new Date(e.event.startDate).toLocaleDateString()}</span>
                       {e.event.location?.name && (
                         <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {e.event.location.name}</span>
                       )}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
