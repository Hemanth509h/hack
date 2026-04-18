import React from "react";
import cn from "clsx";
// Removed date-fns to use native Intl formatter

export const MessageBubble = ({ message, currentUser }) => {
  const isMine =
    currentUser?.id === message.sender._id ||
    currentUser?.id === message.sender.id;

  return (
    <div
      className={cn(
        "flex w-full mt-4 space-x-3 max-w-xl",
        isMine ? "ml-auto justify-end" : "",
      )}
    >
      {!isMine && (
        <div className="flex-shrink-0">
          <img
            src={
              message.sender.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender.name)}&background=random`
            }
            alt="Avatar"
            className="w-8 h-8 rounded-full border border-gray-700"
          />
        </div>
      )}
      <div
        className={cn("flex flex-col", isMine ? "items-end" : "items-start")}
      >
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center space-x-2">
          {!isMine && (
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {message.sender.name}
            </span>
          )}
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div
          className={cn(
            "px-4 py-2 rounded-2xl max-w-sm lg:max-w-md break-words",
            isMine
              ? "bg-primary-600 text-gray-900 dark:text-white rounded-br-none"
              : "bg-gray-50 dark:bg-gray-800 border border-gray-700 text-gray-200 rounded-bl-none",
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};
