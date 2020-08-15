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

export const remakeDate = (date) => {
  const monthValue = new Date(date).toISOString().substr(5, 2);
  const dateValue = new Date(date).toISOString().substr(8, 2);
  const yearValue = new Date(date).toISOString().substr(2, 2);
  const timeValue = new Date(date).toISOString().substr(11, 5);

  return `${dateValue}/${monthValue}/${yearValue} ${timeValue}`;
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

export const setOffers = (item) => {
  const offersEnabled = Object
  .values(item.offers)
  .filter((it) => {
    return it;
  });

  const offersChecked = {
    luggage: offersEnabled[0].isEnabled ? `checked` : ``,
    comfort: offersEnabled[1].isEnabled ? `checked` : ``,
    meal: offersEnabled[2].isEnabled ? `checked` : ``,
    seats: offersEnabled[3].isEnabled ? `checked` : ``,
    train: offersEnabled[4].isEnabled ? `checked` : ``
  };

  return offersChecked;
};
