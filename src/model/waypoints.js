import Observer from '../utils/observer.js';

export default class Waypoints extends Observer {
  constructor() {
    super();
    this._waypoints = [];
    this._wapointsCount = 0;
  }

  getWaypoints() {
    return this._waypoints;
  }

  setWaypoints(updateType, waypoints) {
    this._waypoints = waypoints.slice();
    this._wapointsCount = this._waypoints.length;
    this._notify(updateType);
  }

  updateWaypoint(updateType, update) {
    const index = this._waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update`);
    }

    this._waypoints = [
      ...this._waypoints.slice(0, index),
      update,
      ...this._waypoints.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addWaypoint(updateType, update) {
    this._waypoints = [
      update,
      ...this._waypoints
    ];

    this._notify(updateType, update);
  }

  deleteWaypoint(updateType, update) {
    const index = this._waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete`);
    }

    this._waypoints = [
      ...this._waypoints.slice(0, index),
      ...this._waypoints.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(waypoint) {
    const offersWaypoint = Object
      .values(waypoint.offers)
      .map((offer) => {
        return {
          title: offer.title,
          price: offer.price,
          isEnabled: offer.is_enabled || false
        };
      });

    const adaptedWaypoint = Object.assign(
        {},
        waypoint,
        {
          price: waypoint.base_price,
          startDate: waypoint.date_from,
          endDate: waypoint.date_to,
          isFavorite: waypoint.is_favorite,
          offers: offersWaypoint
        }
    );

    delete adaptedWaypoint.base_price;
    delete adaptedWaypoint.date_from;
    delete adaptedWaypoint.date_to;
    delete adaptedWaypoint.is_favorite;

    return adaptedWaypoint;
  }

  static adaptToServer(waypoint) {
    const adaptedOffers = Object
      .values(waypoint.offers)
      .map((offers) => {
        return {
          "title": offers.title,
          "price": offers.price,
          "is_enabled": offers.isEnabled
        };
      });

    const adaptedWaypoint = Object.assign(
        {},
        waypoint,
        {
          "base_price": waypoint.price,
          "date_from": new Date(waypoint.startDate).toISOString(),
          "is_favorite": waypoint.isFavorite,
          "date_to": new Date(waypoint.endDate).toISOString(),
          "offers": adaptedOffers
        }
    );

    delete adaptedWaypoint.price;
    delete adaptedWaypoint.startDate;
    delete adaptedWaypoint.endDate;
    delete adaptedWaypoint.isFavorite;

    return adaptedWaypoint;
  }
}
