const STORE_VER = `v1`;

export const StoreKey = {
  WAYPOINTS: `bigtrip-localstorage-waypoints`,
  OFFERS: `bigtrip-localstorage-offers`,
  DESTINATIONS: `bigtrip-localstorage-destinations`
};

export const getStoreKey = (key) => {
  return `${key}-${STORE_VER}`;
};

export const getModifiedDestinations = (items) => {
  return Object
    .values(items)
    .map((item) => {
      for (const picture of item.pictures) {
        picture.src = `img/plug.png`;
      }
      return item;
    });
};

export const getModifiedWaypoints = (items) => {
  return Object
    .values(items)
    .map((item) => {
      for (const picture of item.destination.pictures) {
        picture.src = `img/plug.png`;
      }
      return item;
    });
};
