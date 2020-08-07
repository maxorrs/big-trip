export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const nameMounth = {
  1: 'JAN',
  2: 'FEB',
  3: 'MAR',
  4: 'APR',
  5: 'MAY',
  6: 'JUN',
  7: 'JUL',
  8: 'AUG',
  9: 'SEM',
  10: 'OCT',
  11: 'NOV',
  12: 'DEC'
};

export const sortByStartTime = (start, end) => {
  
  if (start > end) {
    return 1;
  } else if (start < end) {
    return -1;
  } else {
    return 0;
  }
};
