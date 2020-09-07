import Adapter from './utils/adapter.js';

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

const UrlApi = {
  POINTS: `points`,
  OFFERS: `offers`,
  DESTINATIONS: `destinations`
}

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getWaypoints() {
    return this._load({url: UrlApi.POINTS})
      .then(Api.toJSON)
      .then((waypoints) => waypoints.map(Adapter.adaptToClient));
  }

  getOffers() {
    return this._load({url: UrlApi.OFFERS})
      .then(Api.toJSON)
  }
  
  getDestinations() {
    return this._load({url: UrlApi.DESTINATIONS})
      .then(Api.toJSON)
  }

  updateWaypoint(waypoint) {
    return this._load({
      url: `${UrlApi.POINTS}/${waypoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(Adapter.adaptToServer(waypoint)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(Adapter.adaptToClient);
  }

  addWaypoint(waypoint) {
    return this._load({
      url: UrlApi.POINTS,
      method: Method.POST,
      body: JSON.stringify(Adapter.adaptToServer(waypoint)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(Adapter.adaptToClient);
  }

  deleteWaypoint(waypoint) {
    return this._load({
      url: `${UrlApi.POINTS}/${waypoint.id}`,
      method: Method.DELETE
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);
    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}