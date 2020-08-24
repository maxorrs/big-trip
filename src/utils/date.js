import moment from 'moment';

export const PruningDate = {
  VALUE_FROM_MONTH: 5,
  VALUE_FROM_DATE: 8,
  LENGTH_SHORT: 2,
  LENGTH_FULL_DATE: 10
};

export const formatDateForEditComponent = (date) => {
  return moment(date).format(`DD/MM/YY HH:mm`);
};

export const formatDateForDayContainer = (date) => {
  return moment(date).format(`D MMM`).toUpperCase();
};

export const formatFullDateForAttr = (date) => {
  return moment(date).format(`DD-MM-YY`);
};

export const formatTimeForWaypoint = (time) => {
  return moment(time).format(`HH:mm`);
};

export const formatDateForWaypoint = (date) => {
  return moment(date).format(`DD-MM-YYTHH:mm`);
};

export const formateDateForSelector = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

export const getTimeRange = (startDate, endDate) => {
  const startTimeInMs = new Date(startDate).getTime();
  const endTimeInMs = new Date(endDate).getTime();
  const range = moment.duration(endTimeInMs - startTimeInMs);

  const duration = {
    days: range.days(),
    hours: range.hours(),
    minutes: range.minutes()
  };

  if (duration.days > 0) {
    return `${duration.days}D ${duration.hours}H ${duration.minutes}M`;
  }

  return `${duration.hours}H ${duration.minutes}M`;
};
