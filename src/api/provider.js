import {StoreKey} from '../utils/store.js';
import {nanoid} from 'nanoid';
import Adapter from '../utils/adapter.js';

const getSyncedWaypoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const getSyncedNewWaypoints = (items) => {
  return items.map((item) => item);
};

const createStoreStructureWaypoints = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

const createStoreStructureExtra = (extra) => {
  return extra.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.type || current.name]: current
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getWaypoints() {
    if (this._isOnline()) {
      return this._api.getWaypoints()
        .then((waypoints) => {
          const items = createStoreStructureWaypoints(waypoints.map(Adapter.adaptToServer));
          this._store.setItems(StoreKey.WAYPOINTS, items);
          return waypoints;
        });
    }

    const storeWaypoints = Object.values(this._store.getItems(StoreKey.WAYPOINTS, true));

    return Promise.resolve(storeWaypoints.map(Adapter.adaptToClient));
  }

  getOffers() {
    if (this._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createStoreStructureExtra(offers);
          this._store.setItems(StoreKey.OFFERS, items);
          return offers;
        });
    }

    const storeOffers = Object.values(this._store.getItems(StoreKey.OFFERS));
    return Promise.resolve(storeOffers);
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = createStoreStructureExtra(destinations);
          this._store.setItems(StoreKey.DESTINATIONS, items);
          return destinations;
        });
    }

    const storeDestinations = Object.values(this._store.getItems(StoreKey.DESTINATIONS, true));
    return Promise.resolve(storeDestinations);
  }

  updateWaypoint(waypoint) {
    if (this._isOnline()) {
      return this._api.updateWaypoint(waypoint)
        .then((updatedWaypoint) => {
          this._store.setItem(updatedWaypoint.id, Adapter.adaptToServer(updatedWaypoint));
          return updatedWaypoint;
        });
    }

    this._store.setItem(
        waypoint.id,
        Adapter.adaptToServer(Object.assign({}, waypoint))
    );

    return Promise.resolve(waypoint);
  }

  addWaypoint(waypoint) {
    if (this._isOnline()) {
      return this._api.addWaypoint(waypoint)
        .then((newWaypoint) => {
          this._store.setItem(
              newWaypoint.id,
              Adapter.adaptToServer(newWaypoint)
          );

          return newWaypoint;
        });
    }

    const localNewWaypointId = nanoid();
    const localNewWaypoint = Object.assign({}, waypoint, {id: localNewWaypointId});
    this._store.setItem(
        localNewWaypoint.id,
        Adapter.adaptToServer(localNewWaypoint, true)
    );

    return Promise.resolve(localNewWaypoint);
  }

  deleteWaypoint(waypoint) {
    if (this._isOnline()) {
      return this._api.deleteWaypoint(waypoint)
        .then(() => this._store.removeItem(waypoint.id));
    }

    this._store.removeItem(waypoint.id);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnline()) {
      const storeWaypoints = Object.values(this._store.getItems(StoreKey.WAYPOINTS));
      const waypointsWithPictures = this._setPictures(storeWaypoints);
      return this._api.sync(waypointsWithPictures)
        .then((response) => {
          const createdWaypoints = getSyncedNewWaypoints(response.created);
          const updatedWaypoint = getSyncedWaypoints(response.updated);
          const items = createStoreStructureWaypoints([...createdWaypoints, ...updatedWaypoint]);
          this._store.setItems(StoreKey.WAYPOINTS, items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  _setPictures(items) {
    const destinationsStore = this._store.getItems(StoreKey.DESTINATIONS);
    const destinations = Object.values(destinationsStore).map((item) => item);

    const updateWaypoints = Object
      .values(items)
      .map((item) => {
        for (const dest of destinations) {
          if (dest.name === item.destination.name) {
            return Object.assign({}, item, {destination: dest});
          }
        }
        return item;
      });

    return updateWaypoints;
  }
}
