import {Tense} from '../consts.js';
import moment from 'moment-timezone';

const momentTZ = (time) => {
  return moment(time).tz(`America/Danmarkshavn`);
};

export const formatDateForEditComponent = (date) => {
  return momentTZ(date).format(`DD/MM/YY HH:mm`);
};

export const formatDateForDayContainer = (date) => {
  return moment(date).format(`D MMM`).toUpperCase();
};

export const formatFullDateForAttr = (date) => {
  return momentTZ(date).format(`DD-MM-YY`);
};

export const formatTimeForWaypoint = (time) => {
  return momentTZ(time).format(`HH:mm`);
};

export const formatDateForWaypoint = (date) => {
  return momentTZ(date).format(`DD-MM-YYTHH:mm`);
};

export const formateDateForSelector = (date) => {
  return momentTZ(date).format(`YYYY-MM-DD`);
};

export const getTimeRange = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  const range = moment.duration(end - start);

  const duration = {
    days: end.diff(start, `days`),
    hours: range.hours(),
    minutes: range.minutes()
  };

  if (duration.days > 0) {
    return `${duration.days}D ${duration.hours}H ${duration.minutes}M`;
  }

  return `${duration.hours}H ${duration.minutes}M`;
};

export const isDatesEqual = (firstDate, secondDate) => {
  return moment(firstDate).isSame(secondDate);
};

export const isFutureOrPast = (date, time) => {
  return time === Tense.FUTURE ? moment(date).isAfter() : moment(date).isBefore();
};

export const isInvalidDateRange = (data) => {
  return moment(data.startDate).isAfter(data.endDate);
};
