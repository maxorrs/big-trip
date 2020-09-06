const DEFAULT_TYPE = `taxi`;

export const createPhoto = (photos) => {
  if (!photos) {
    return ``;
  }

  let result = ``;
  for (const photo of photos) {
    result += `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
  }

  return result;
};

export const getUniqueCities = (destination) => {
  const cities = Object
    .values(destination)
    .map((item) => item.name)
    .sort();

  return new Set(cities);
};

export const getDatalist = (uniqueCities) => {
  let result = ``;

  for (const city of uniqueCities.keys()) {
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

export const getDefaultOffers = (offers) => {
  const defaultOffer = Object
    .values(offers)
    .filter((offer) => offer.type === DEFAULT_TYPE.toLowerCase())
    .map((item) => {
      return item.offers;
    });

  return defaultOffer;
};

export const getBlankWaypoint = (offers) => {
  const defaultOffers = getDefaultOffers(offers);

  return {
    type: DEFAULT_TYPE,
    destination: {
      name: ``,
      description: ``,
      photos: []
    },
    price: ``,
    offers: defaultOffers[0],
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    isFavorite: false
  };
};

export const updateOffers = (allOffers, nameInput) => {
  const changeOffer = allOffers
      .slice()
      .filter((item) => item.title === nameInput)
      .map((offer) => {
        return {
          title: offer.title,
          price: offer.price,
          isEnabled: !offer.isEnabled
        };
      });

  const index = allOffers.findIndex((offer) => offer.title === changeOffer[0].title);

  if (index === -1) {
    throw new Error(`Can't update`);
  }

  return [
    ...allOffers.slice(0, index),
    changeOffer[0],
    ...allOffers.slice(index + 1)
  ];
};

export const getConcatNameOffers = (name) => {
  return name.replace(/[\s',]/g, `-`).toLowerCase();
};
