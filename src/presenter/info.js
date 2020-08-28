import TripInfoView from '../view/trip-info.js';
import TripTabsView from '../view/trip-tabs.js';
import TripAddButton from '../view/trip-add-button.js';
import {RenderPosition, render, replace, remove} from '../utils/render.js';
import {getUniqueDates, getCitiesForInfo, getFinalAmount} from '../utils/waypoint.js';


export default class Info {
  constructor(infoContainer, waypointsModel, tripPresenter) {
    this._infoContainer = infoContainer;
    this._waypointsModel = waypointsModel;
    this._tripPresenter = tripPresenter;

    this._tripTabsComponent = new TripTabsView();
    this._tripAddButton = new TripAddButton();
    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._waypointsModel.addObserver(this._handleModelEvent);
    this._newEventClickHandler = this._newEventClickHandler.bind(this);

    this._tripAddButton.getElement().addEventListener(`click`, this._newEventClickHandler);
  }

  init() {
    this._renderButton();
    this._renderTabs();
    this._getInfo();
  }

  _getInfo() {
    const waypoints = this._waypointsModel.getWaypoints();
    const uniqueDates = getUniqueDates(waypoints);
    const citiesForInfo = getCitiesForInfo(waypoints);
    const amount = getFinalAmount(waypoints);

    this._renderInfo(uniqueDates, citiesForInfo, amount);
  }

  _renderInfo(uniqueDates, citiesForInfo, amount) {
    const mainContainer = this._infoContainer.querySelector(`.trip-main`);
    const prevInfoComponent = this._tripInfoComponent;
    this._tripInfoComponent = new TripInfoView(uniqueDates, citiesForInfo, amount);

    if (prevInfoComponent === null) {
      render(mainContainer, RenderPosition.AFTERBEGIN, this._tripInfoComponent);
      return;
    }

    replace(this._tripInfoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  _renderTabs() {
    const tripContainer = this._infoContainer.querySelector(`.trip-controls > h2`);
    render(tripContainer, RenderPosition.AFTEREND, this._tripTabsComponent);
  }

  _renderButton() {
    const mainContainer = this._infoContainer.querySelector(`.trip-main`);
    render(mainContainer, RenderPosition.BEFOREEND, this._tripAddButton);
  }

  _newEventClickHandler(evt) {
    evt.preventDefault();
    this._tripPresenter.createWaypoint();
  }

  _handleModelEvent() {
    this.init();
  }
}
