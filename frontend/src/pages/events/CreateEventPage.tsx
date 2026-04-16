import React from 'react';
import { EventForm } from '../../components/events/EventForm';

export const CreateEventPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Host an Event
        </h1>
        <p className="text-gray-400 text-lg">
          Bring the campus together. Fill out the details below to publish your event to The Quad.
        </p>
      </div>
      
      <EventForm />
    </div>
  );
};

export default CreateEventPage;
