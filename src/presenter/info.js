import TripInfoView from '../view/trip-info.js';
import TripTabsView from '../view/trip-tabs.js';
import TripAddButtonView from '../view/trip-add-button.js';
import {RenderPosition, render, replace, remove} from '../utils/render.js';
import {MenuItem} from '../consts.js';
import {getUniqueDates, getCitiesForInfo, getFinalAmount} from '../utils/waypoint.js';


export default class Info {
  constructor(infoContainer, waypointsModel, tripPresenter, menuHandler) {
    this._infoContainer = infoContainer;
    this._mainContainer = this._infoContainer.querySelector(`.trip-main`);
    this._waypointsModel = waypointsModel;
    this._tripPresenter = tripPresenter;

    this._menuHandler = menuHandler;

    this._tripTabsComponent = null;
    this._tripAddButtonComponent = null;
    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleWaypointNewForm = this._handleWaypointNewForm.bind(this);

    this._waypointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderButton();
    this._renderTabs();
    this._getInfo();
    this._handlers();
  }

  _handlers() {
    this._tripTabsComponent.setMenuClickHandler(this._menuHandler);
    this._tripAddButtonComponent.setMenuClickHandler(this._menuHandler);
  }

  _handleWaypointNewForm() {
    this._tripAddButtonComponent.setMenuItem(MenuItem.ADD_WAYPOINT);
  }

  setMenuItemTable() {
    this._tripTabsComponent.setMenuItem(MenuItem.TABLE);
  }

  setMenuItemStats() {
    this._tripTabsComponent.setMenuItem(MenuItem.STATS);
  }

  _getInfo() {
    const waypoints = this._waypointsModel.getWaypoints();
    const uniqueDates = getUniqueDates(waypoints);
    const citiesForInfo = getCitiesForInfo(waypoints);
    const amount = getFinalAmount(waypoints);

    this._renderInfo(uniqueDates, citiesForInfo, amount);
  }

  _renderInfo(uniqueDates, citiesForInfo, amount) {
    const prevInfoComponent = this._tripInfoComponent;
    this._tripInfoComponent = new TripInfoView(uniqueDates, citiesForInfo, amount);

    if (prevInfoComponent === null) {
      render(this._mainContainer, RenderPosition.AFTERBEGIN, this._tripInfoComponent);
      return;
    }

    replace(this._tripInfoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  _renderTabs() {
    const tripContainer = this._infoContainer.querySelector(`.trip-controls > h2`);

    const prevTabsComponent = this._tripTabsComponent;
    this._tripTabsComponent = new TripTabsView(this._currentMenuItem);

    if (prevTabsComponent === null) {
      render(tripContainer, RenderPosition.AFTEREND, this._tripTabsComponent);
      return;
    }

    replace(this._tripTabsComponent, prevTabsComponent);
    remove(prevTabsComponent);
  }

  _renderButton() {
    const prevAddButtonComponent = this._tripAddButtonComponent;
    this._tripAddButtonComponent = new TripAddButtonView(this._currentMenuItem);

    if (prevAddButtonComponent === null) {
      render(this._mainContainer, RenderPosition.BEFOREEND, this._tripAddButtonComponent);
      return;
    }
    this._tripAddButtonComponent.getElement().addEventListener(`click`, this._newEventClickHandler);

    replace(this._tripAddButtonComponent, prevAddButtonComponent);
    remove(prevAddButtonComponent);
  }

  createFormNewWaypoint() {
    this._tripPresenter.createFormNewWaypoint(this._handleWaypointNewForm);
  }

  destroyFormNewWaypoint() {
    this._tripPresenter.destroyFormNewWaypoint();
  }

  _handleModelEvent() {
    this.init();
  }
}
