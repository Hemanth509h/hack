import React from "react";
import { useGetEventAttendeesQuery } from "../../services/eventApi";
import { Loader2 } from "lucide-react";

export const AttendeeList = ({ eventId }) => {
  const { data, isLoading, error } = useGetEventAttendeesQuery(eventId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-sm text-gray-500 py-4">
        Waitlist hidden or unavailable.
      </div>
    );
  }

  const attendees = data.attendees;
  const displayLimit = 10;
  const visibleAttendees = attendees.slice(0, displayLimit);
  const remainingCount = attendees.length - displayLimit;

  return (
    <div className="flex -space-x-4 overflow-hidden py-4">
      {visibleAttendees.map((attendee, index) => (
        <div
          key={attendee._id || index}
          className="inline-block h-12 w-12 rounded-full ring-4 ring-gray-950 bg-gray-50 dark:bg-gray-800 relative group"
        >
          <img
            className="h-full w-full rounded-full object-cover"
            src={
              attendee.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(attendee.name || "User")}&background=random`
            }
            alt={attendee.name}
          />

          {/* Tooltip on hover */}
          <div className="absolute top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-white px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
            {attendee.name}
          </div>
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full ring-4 ring-gray-950 bg-gray-50 dark:bg-gray-800 hover:bg-gray-700 transition-colors z-10 text-sm font-medium text-gray-900 dark:text-white cursor-help">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
