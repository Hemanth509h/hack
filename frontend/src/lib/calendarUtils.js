import { IEvent } from '../types/event';

export const buildGoogleCalendarUrl = (event) => {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + (event.durationMinutes || 60) * 60000);

  const formatDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDate(start)}/${formatDate(end)}`,
    details: event.description,
  });

  if (event.locationDetails) params.append('location', event.locationDetails);
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const buildOutlookCalendarUrl = (event) => {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + (event.durationMinutes || 60) * 60000);

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    subject: event.title,
    body: event.description || '',
  });

  if (event.locationDetails) params.append('location', event.locationDetails);

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

export const getIcsDownloadUrl = (eventId) => {
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/events/${eventId}/calendar.ics`;
};
