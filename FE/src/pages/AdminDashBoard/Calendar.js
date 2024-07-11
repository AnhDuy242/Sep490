import React from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Calendar = ({ events, defaultDate, defaultView, min, max }) => {
  return (
    <BigCalendar
      events={events}
      defaultDate={moment(defaultDate).toDate()}
      defaultView={defaultView}
      min={moment(min).toDate()}
      max={moment(max).toDate()}
      localizer={localizer}
    />
  );
};

export default Calendar;
