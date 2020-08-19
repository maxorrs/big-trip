export const NameMonth = {
  1: `JAN`,
  2: `FEB`,
  3: `MAR`,
  4: `APR`,
  5: `MAY`,
  6: `JUN`,
  7: `JUL`,
  8: `AUG`,
  9: `SEM`,
  10: `OCT`,
  11: `NOV`,
  12: `DEC`
};

export const getSumWaypoint = (waypoint) => {
  const amount = Object
    .values(waypoint.offers)
    .filter((it) => {
      return it.isEnabled;
    })
    .map((it) => {
      return it.price;
    })
    .reduce((total, value) => {
      return total + value;
    }, 0);

  return amount;
};

export const getTime = (time) => {
  const val = new Date(time);
  const hours = `${val.getHours() < 10 ? `0` : ``}${val.getHours()}`;

  const minutes = `${val.getMinutes() < 10 ? `0` : ``}${val.getMinutes()}`;
  const result = `${hours}:${minutes}`;

  return result;
};

export const getTimeRange = (timeObj) => {
  const startTimeInMs = new Date(timeObj.startTime).getTime();
  const endTimeInMs = new Date(timeObj.endTime).getTime();
  const maxValueMinutes = 59;
  const timeInHour = 60;
  const timeInDay = 24;

  const diffTime = new Date(endTimeInMs - startTimeInMs);
  const minutes = diffTime.getMinutes();
  const hours = diffTime.getHours() * timeInHour;
  const days = diffTime.getDate() * timeInHour * timeInDay;
  const sumMin = minutes + hours + days;

  let result;
  if (sumMin <= maxValueMinutes) {
    result = `${sumMin}M`;
  } else {
    const minutesValue = sumMin % timeInHour;
    const remainsMinutes = sumMin - minutesValue;
    const hoursValue = remainsMinutes / timeInHour % timeInDay;
    const remainsHours = remainsMinutes / timeInHour - hoursValue;
    const daysValue = remainsHours / timeInDay;

    result = daysValue ? `${daysValue}D ${hoursValue}H ${minutesValue}M` : `${hoursValue}H ${minutesValue}M`;
  }
  return result;
};

export const getType = (type) => {
  let result = ``;

  switch (type) {
    case `Check`:
    case `Sightseeing`:
    case `Restaurant`:
      result = `${type} in`;
      break;
    default:
      result = `${type} to`;
      break;
  }

  return result;
};

export const sortTime = (a, b) => {
  const timeA = new Date(a.time.endTime).getTime() - new Date(a.time.startTime).getTime();
  const timeB = new Date(b.time.endTime).getTime() - new Date(b.time.startTime).getTime();

  if (timeA < timeB) {
    return 1;
  } else if (timeA > timeB) {
    return -1;
  }

  return 0;
};

export const sortPrice = (a, b) => {
  const priceA = getSumWaypoint(a);
  const priceB = getSumWaypoint(b);

  if (priceA < priceB) {
    return 1;
  } else if (priceA > priceB) {
    return -1;
  }

  return 0;
};
