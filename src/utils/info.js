export const getRoute = (cities = {}) => {
  let result = ``;
  for (const city of cities) {
    result += `${city} &mdash; `;
  }

  return result.slice(0, -9);
};
