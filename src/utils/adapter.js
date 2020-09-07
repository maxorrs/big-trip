export default class Adapter {
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
          "is_enabled": offers.isEnabled || false
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
