export const createPhoto = (photos) => {
  if (!photos) {
    return ``;
  }

  let result = ``;

  for (const photo of photos) {
    result += `<img class="event__photo" src="${photo}" alt="Event photo">`;
  }

  return result;
};

export const getCitiesDatalist = () => {
  return new Set([`Amsterdam`, `Geneva`, `Madrid`, `Marrakesh`, `Warsaw`]);
};

export const getDatalist = () => {
  // Завел пока даталист с городами через костыль, потому что не понимаю, как будет приходить список с сервера.
  let uniqueCitiesDatalist = new Set([`Amsterdam`, `Geneva`, `Madrid`, `Marrakesh`, `Warsaw`]);
  let result = ``;

  for (const city of uniqueCitiesDatalist.keys()) {
    result += `<option value="${city}">${city}</option>`;
  }

  return result;
};

export const getSumPrice = (item) => {
  const result = Object
  .values(item.offers)
  .filter((it) => {
    return it.isEnabled === true;
  }).map((it) => {
    return it.price;
  })
  .reduce((total, value) => {
    return total + value;
  }, 0);

  return result;
};
