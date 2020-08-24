export const createPhoto = (photos) => {
  let result = ``;

  for (const photo of photos) {
    result += `<img class="event__photo" src="${photo}" alt="Event photo">`;
  }

  return result;
};

export const getDatalist = (uniqueCitiesDatalist) => {
  let result = ``;

  for (const city of uniqueCitiesDatalist.keys()) {
    result += `<option value="${city}"></option>`;
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
