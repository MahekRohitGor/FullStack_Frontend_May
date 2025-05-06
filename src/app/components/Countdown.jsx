"use client";
import React from 'react';
import Countdown from 'react-countdown';

const Completionist = () => (
  <span className="text-green-600 font-bold">You are good to go!</span>
);

const Renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <Completionist />;
  }
  return (
    <span className="text-purple-600 font-bold">
      Starts in: {days}d  {hours}h {minutes}m {seconds}s
    </span>
  );
};

const EventCountdown = ({ eventDate, eventTime }) => {
    const datePart = eventDate.split('T')[0];
    const eventDateTime = new Date(`${datePart}T${eventTime}`);

  return (
    <div className="mb-2">
      <Countdown 
        date={eventDateTime}
        renderer={Renderer}
      />
    </div>
  );
};

export default EventCountdown;