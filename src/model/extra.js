import Observer from '../utils/observer.js';

export default class Extra extends Observer {
  constructor() {
    super();
    this._offers = [];
    this._destinations = [];
  }

  getOffers() {
    return this._offers;
  }

  getDestinations() {
    return this._destinations;
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }
}
