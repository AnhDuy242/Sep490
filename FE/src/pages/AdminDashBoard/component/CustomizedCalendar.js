import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { Select, MenuItem, FormControl, InputLabel, Box, Button, Popover, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete } from '@mui/material';
import { RESOURCES } from './constants/constants'; // Điều chỉnh đường dẫn import nếu cần thiết
import 'moment/locale/vi';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MailIcon from '@mui/icons-material/Mail';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const Calendar = ({ events, defaultDate, defaultView, min, max }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false); // State để điều khiển modal chỉnh sửa

  // Hàm xử lý thay đổi bác sĩ được chọn
  const handleDoctorChange = (event) => {
    const value = event.target.value;
    setSelectedDoctor(value ? parseInt(value) : null);
  };

  // Lọc sự kiện dựa trên bác sĩ được chọn
  const filteredEvents = selectedDoctor
    ? events.filter((event) => event.resourceId === selectedDoctor)
    : events;

  // Xử lý khi chọn một sự kiện trên lịch
  const handleSelectEvent = (event, e) => {
    setSelectedEvent(event);
    setAnchorEl(e.currentTarget);
  };

  // Mở modal chỉnh sửa sự kiện
  const handleEdit = () => {
    setOpenEditModal(true);
  };

  // Đóng popover hoặc modal
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  // Xử lý thay đổi thông tin của sự kiện
  const handleEventChange = (field, value) => {
    setSelectedEvent({
      ...selectedEvent,
      [field]: value,
    });
  };

  // Xử lý khi kéo thả sự kiện trên lịch
  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    console.log('Updated Event:', updatedEvent);
    // Cập nhật backend hoặc state tùy theo yêu cầu
  };

  // Xử lý khi chọn một khoảng thời gian trên lịch
  const handleSelectSlot = (slotInfo) => {
    console.log('Selected Slot:', slotInfo);
  };

  // Xử lý khi đang chọn một khoảng thời gian trên lịch
  const handleSelecting = (range) => {
    setDragging(true);
  };

  // Kết thúc việc chọn khoảng thời gian trên lịch
  const handleSelectingDone = () => {
    setDragging(false);
  };

  // Đóng modal chỉnh sửa sự kiện
  const handleEditModalClose = () => {
    setOpenEditModal(false);
  };

  // Kiểm tra popover có mở hay không
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <FormControl variant="outlined" style={{ marginBottom: '16px', width: '200px' }}>
        <InputLabel>Choose a doctor</InputLabel>
        <Select value={selectedDoctor || ''} onChange={handleDoctorChange} label="Choose a doctor">
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {RESOURCES.map(resource => (
            <MenuItem key={resource.id} value={resource.id}>{resource.title}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <DragAndDropCalendar
        selectable
        events={filteredEvents.map(event => ({
          ...event,
          start: moment(event.start).toDate(),
          end: moment(event.end).toDate(),
        }))}
        defaultDate={moment(defaultDate).toDate()}
        defaultView={defaultView}
        min={moment(min).toDate()}
        max={moment(max).toDate()}
        localizer={localizer}
        style={{ height: 'calc(100vh - 64px)' }}
        onEventDrop={handleEventDrop}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onSelecting={handleSelecting}
        onSelectingDone={handleSelectingDone}
        eventPropGetter={(event, start, end, isSelected) => {
          if (dragging && selectedEvent && selectedEvent.id === event.id) {
            return {
              style: {
                opacity: 0.5,
              },
            };
          }
          return {};
        }}
        // Định nghĩa các props cho từng sự kiện trên lịch
        components={{
          event: ({ event }) => (
            <div
              className="rbc-event custom-slot" // Thêm class custom-slot vào đây
              style={{
                backgroundColor: event.resourceId === 1 ? '#ffcccb' : '#b3e5fc', // Màu nền khác nhau cho từng bác sĩ
                borderRadius: '5px',
                padding: '2px 5px',
                cursor: 'pointer', // Con trỏ chuột dạng pointer khi hover
              }}
              onClick={(e) => handleSelectEvent(event, e)}
            >
              {event.title}
            </div>
          ),
        }}
      />

      {/* Popover hiển thị thông tin chi tiết sự kiện */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {selectedEvent && (
          <Box p={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton onClick={handleEdit}>
                <EditIcon />
              </IconButton>
              <IconButton>
                <DeleteIcon />
              </IconButton>
              <IconButton>
                <MailIcon />
              </IconButton>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Typography variant="h6">{selectedEvent.title}</Typography>
            <Typography variant="body2">
              Start: {moment(selectedEvent.start).format('LLL')}
            </Typography>
            <Typography variant="body2">
              End: {moment(selectedEvent.end).format('LLL')}
            </Typography>
            {/* Thêm thông tin chi tiết sự kiện nếu cần */}
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </Box>
        )}
      </Popover>

      {/* Modal chỉnh sửa sự kiện */}
      <Dialog open={openEditModal} onClose={handleEditModalClose} fullWidth>
        <Box display="flex" alignItems="center">
          <DialogTitle>Edit Event</DialogTitle>
          <DialogActions sx={{ ml: 32 }}>
            <Button onClick={handleEditModalClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditModalClose} color="primary">
              Save
            </Button>
          </DialogActions>
        </Box>

        <DialogContent>
          <Box display="flex" alignItems="center">
            <TextField
              autoFocus
              margin="dense"
              id="event-title"
              label="Event Title"
              fullWidth
              value={selectedEvent?.title || ''}
              onChange={(event) => handleEventChange('title', event.target.value)}
            />
          </Box>
          <Box>
            <Typography margin={1} fontSize={10}>
              (GMT+07:00) Indochina Time - Ho Chi Minh City
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <TextField
              id="start-date"
              label="Start Date"
              type="date"
              defaultValue={moment(selectedEvent?.start).format('YYYY-MM-DD')}
              onChange={(event) => handleEventChange('startDate', event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              margin="dense"
            />
            <Autocomplete
              fullWidth
              freeSolo
              id="start-time"
              options={generateTimeOptions()}
              getOptionLabel={(option) => option.props.children}
              value={generateTimeOptions().find(option => option.props.value === moment(selectedEvent?.start).format('HH:mm'))}
              onChange={(event, value) => handleEventChange('start-time', value.props.value)}
              renderInput={(params) => <TextField {...params} label="Start Time" margin="dense" />}
            />
          </Box>
          <Box>
            <Typography marginTop={2} marginBottom={2} marginLeft={2} fontSize={13}>
              To
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <TextField
              id="end-date"
              label="End Date"
              type="date"
              fullWidth
              defaultValue={moment(selectedEvent?.end).format('YYYY-MM-DD')}
              onChange={(event) => handleEventChange('endDate', event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              margin="dense"
            />
            <Autocomplete
              freeSolo
              fullWidth
              id="end-time"
              options={generateTimeOptions()}
              getOptionLabel={(option) => option.props.children}
              value={generateTimeOptions().find(option => option.props.value === moment(selectedEvent?.end).format('HH:mm'))}
              onChange={(event, value) => handleEventChange('end-time', value.props.value)}
              renderInput={(params) => <TextField {...params} label="End Time" margin="dense" />}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

// Hàm sinh các tuỳ chọn thời gian (ví dụ: 10:00 AM, 10:30 AM, ...)
const generateTimeOptions = () => {
  const times = [];
  const startTime = moment().startOf('day').hours(8);
  const endTime = moment().startOf('day').hours(20).minutes(30);
  while (startTime <= endTime) {
    times.push(
      <MenuItem key={startTime.format('HH:mm')} value={startTime.format('HH:mm')}>
        {startTime.format('LT')}
      </MenuItem>
    );
    startTime.add(30, 'minutes');
  }
  return times;
};

export default Calendar;
