import {getStoreKey, StoreKey, getModifiedDestinations, getModifiedWaypoints} from '../utils/store.js';

export default class Store {
  constructor(storage) {
    this._storage = storage;
  }

  getItems(key, withoutPictures = false) {
    const storeKey = getStoreKey(key);

    try {
      if (withoutPictures) {
        switch (key) {
          case (StoreKey.DESTINATIONS):
            const destinations = JSON.parse(this._storage.getItem(storeKey));
            const modifiedDestinations = getModifiedDestinations(destinations);
            return modifiedDestinations || {};
          case (StoreKey.WAYPOINTS):
            const waypoints = JSON.parse(this._storage.getItem(storeKey));
            const modifiedWaypoints = getModifiedWaypoints(waypoints);
            return modifiedWaypoints || {};
          default:
            break;
        }
      }

      return JSON.parse(this._storage.getItem(storeKey)) || {};

    } catch (err) {
      return {};
    }
  }

  setItems(key, items) {
    const storeKey = getStoreKey(key);

    this._storage.setItem(
        storeKey,
        JSON.stringify(items)
    );
  }

  setItem(objectKey, value) {
    const storeKey = getStoreKey(StoreKey.WAYPOINTS);
    const store = this.getItems(StoreKey.WAYPOINTS);

    this._storage.setItem(
        storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [objectKey]: value
            })
        )
    );
  }

  removeItem(objectKey) {
    const storeKey = getStoreKey(StoreKey.WAYPOINTS);
    const store = this.getItems(StoreKey.WAYPOINTS);

    delete store[objectKey];

    this._storage.setItem(
        storeKey,
        JSON.stringify(store)
    );
  }
}
