import React from 'react';
import { Box } from '@mui/material';
import moment from 'moment';
import { Views } from 'react-big-calendar';
import { EVENTS } from './component/constants/constants.js';
import Calendar from './component/CustomizedCalendar.js';

const NormalCalendar = () => {
  return (
    <Box
      height="100%"
      css={{
        overflow: 'auto',
      }}
    >
      <Calendar
        events={EVENTS}
        defaultDate={"2022-10-10"}
        defaultView={Views.WEEK}
        min={"2022-10-10T09:00:00"}
        max={"2022-10-10T18:00:00"}
      />
    </Box>
  );
};

export default NormalCalendar;
