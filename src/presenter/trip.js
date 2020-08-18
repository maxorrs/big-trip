import TripInfoView from '../view/trip-info.js';
import TripTabsView from '../view/trip-tabs.js';
import TripFiltersView from '../view/trip-filters.js';
import TripSortView from '../view/trip-sort.js';
import EventView from '../view/event.js';
import DaysView from '../view/days.js';
import OneDayView from '../view/one-day.js';
import NoWaypointsView from '../view/no-waypoints.js';
import WaypointView from '../view/waypoint.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {PruningDate} from '../utils/date.js';
import {sortTime, sortPrice} from '../utils/waypoint.js';
import {COUNT_WAYPOINTS, SortType} from '../consts.js';

const THREE_HOURS_IN_MS = 10800000;

export default class Trip {
  constructor(tripContainer, uniqueDatesSet, citiesForInfo, finalAmount, uniqueCitiesDatalist) {
    this._tripContainer = tripContainer;
    this._uniqueDatesSet = uniqueDatesSet;
    this._citiesForInfo = citiesForInfo;
    this._finalAmount = finalAmount;
    this._uniqueCitiesDatalist = uniqueCitiesDatalist;
    this._currenSortType = SortType.DEFAULT;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._tripInfoComponent = new TripInfoView(this._uniqueDatesSet, this._citiesForInfo, this._finalAmount);
    this._tripTabsComponent = new TripTabsView();
    this._tripFiltersComponent = new TripFiltersView();
    this._tripDays = new DaysView();
    this._noWaypointsComponent = new NoWaypointsView();
    this._tripSortComponent = new TripSortView();


    this._tripMainContainer = this._tripContainer.querySelector(`.trip-main`);
    this._tripControls = this._tripContainer.querySelector(`.trip-controls`);
    this._firstTitleTripControls = this._tripControls.querySelector(`h2`);
    this._tripEventsContainer = this._tripContainer.querySelector(`.trip-events`);
  }

  init(waypoints) {
    this._waypoints = waypoints.slice();
    this._sourceWaypoints = waypoints.slice();

    this._renderInfo();

    if (COUNT_WAYPOINTS) {
      this._renderControls();
      this._renderFilters();
      this._renderSort();
      this._renderDays();

      for (const waypoint of this._waypoints) {
        this._renderWaypoints(waypoint);
      }

    } else {
      this._renderNoWaypoints();
    }
  }

  _sortWaypoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._waypoints.sort((a, b) => sortTime(a, b));
        break;
      case SortType.PRICE:
        this._waypoints.sort((a, b) => sortPrice(a, b));
        break;
      default:
        this._waypoints = this._sourceWaypoints.slice();
    }
  }

  _renderInfo() {
    render(this._tripMainContainer, RenderPosition.AFTERBEGIN, this._tripInfoComponent);
  }

  _renderControls() {
    render(this._firstTitleTripControls, RenderPosition.AFTEREND, this._tripTabsComponent);
  }

  _renderFilters() {
    render(this._tripControls, RenderPosition.BEFOREEND, this._tripFiltersComponent);
  }

  _renderDays() {
    render(this._tripEventsContainer, RenderPosition.BEFOREEND, this._tripDays);
    if (this._currenSortType === SortType.DEFAULT) {
      let i = 1;
      for (let value of this._uniqueDatesSet) {
        render(this._tripDays, RenderPosition.BEFOREEND, new OneDayView(i++, value));
      }
    } else {
      render(this._tripDays, RenderPosition.BEFOREEND, new OneDayView());
    }
  }

  _renderWaypoints(waypoint) {
    const waypointEdit = new EventView(this._uniqueCitiesDatalist, waypoint);
    const waypointComponent = new WaypointView(waypoint);

    const startTime = new Date(waypoint.time.startTime).getTime() + THREE_HOURS_IN_MS;
    const time = new Date(startTime).toISOString().substr(0, PruningDate.LENTH_FULL_DATE);

    const replaceFormToCard = () => {
      replace(waypointEdit, waypointComponent);
    };

    const replaceCardToForm = () => {
      replace(waypointComponent, waypointEdit);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceCardToForm();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    waypointComponent.setEditClickHandler(() => {
      replaceFormToCard();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    waypointEdit.setFormSubmitHandler(() => {
      replaceCardToForm();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    waypointEdit.setFormResetHandler(() => {
      replaceCardToForm();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    const selector = this._tripDays.getElement().querySelector(`[data-start-date="${time}"] > .trip-events__list`);

    if (selector) {
      render(selector, RenderPosition.BEFOREEND, waypointComponent);
    } else {
      const oneDayContainer = this._tripDays.getElement().querySelector(`.trip-events__list`);
      render(oneDayContainer, RenderPosition.BEFOREEND, waypointComponent);
    }
  }

  _renderNoWaypoints() {
    render(this._tripEventsContainer, RenderPosition.AFTERBEGIN, this._noWaypointsComponent);
  }

  _clearWaypoints() {
    this._tripDays.getElement().innerHTML = ``;
  }

  _renderSortWaypoints() {
    this._renderDays();
    for (const waypoint of this._waypoints) {
      this._renderWaypoints(waypoint);
    }
  }

  _removeSort() {
    remove(this._tripSortComponent);
  }

  _renderSort() {
    render(this._tripEventsContainer, RenderPosition.BEFOREEND, this._tripSortComponent);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(sortType) {
    if (this._currenSortType === sortType) {
      return;
    }
    this._removeSort();

    this._currenSortType = sortType;

    this._sortWaypoints(sortType);
    this._clearWaypoints();
    this._renderSort();

    this._renderSortWaypoints();
  }
}
