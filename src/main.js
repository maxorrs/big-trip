'use strict';

import TripInfoView from './view/trip-info.js';
import TripTabsView from './view/trip-tabs.js';
import TripFiltersView from './view/trip-filters.js';
import TripSortView from './view/trip-sort.js';
import EventView from './view/event.js';
import DaysView from './view/days.js';
import OneDayView from './view/one-day.js';
import NoWaypointsView from './view/no-waypoints.js';
import WaypointView from './view/waypoint.js';
import {generateWaypoint} from './mock/waypoint.js';
import {COUNT_WAYPOINTS} from './consts.js';
import {RenderPosition, render} from './util.js';

const MAX_COUNT_CITY_INFO = 3;
const THREE_HOURS_IN_MS = 10800000;

const waypoints = new Array(COUNT_WAYPOINTS)
  .fill()
  .map(generateWaypoint)
  .sort((a, b) => {
    const firstDate = new Date (a.time.startTime).getTime();
    const secondDate = new Date (b.time.startTime).getTime();
  
    if (firstDate > secondDate) {
      return 1;
    } else if (firstDate < secondDate) {
      return -1;
    } 

    return 0;
  });

const uniqueDates = waypoints
  .slice()
  .map((waypoint) => {
    return waypoint.time.startTime.substr(0,10); 
  });

const uniqueDatesSet = new Set (uniqueDates);

const cities = waypoints
  .slice()
  .map((waypoint) => {
    return {
      city: waypoint.city,
      startTime: waypoint.time.startTime
    }
  })
  .sort((a, b) => {
    const firstDate = new Date(a.startTime).getTime();
    const secondDate = new Date(b.startTime).getTime();
    
    if (firstDate > secondDate) {
      return 1;
    } else if (firstDate < secondDate) {
      return -1;
    } 

    return 0;
  });

const citiesDatalist = cities
  .slice()
  .map((it) => {
    return it.city;
  })
  .sort();

const uniqueCitiesDatalist = new Set(citiesDatalist);

let citiesForInfo = [];

if (cities.length > MAX_COUNT_CITY_INFO) {
  citiesForInfo.push(cities[0].city);
  citiesForInfo.push('...');
  citiesForInfo.push(cities[cities.length - 1].city);
} else {
  citiesForInfo = cities
  .slice()
  .map((it) => {
    return it.city;
  });
}

let finalAmount = 0;

const getFinalAmount = (waypoint) => {
  const amount = Object
    .values(waypoint.offers)
    .filter((it) => {
      return it.isEnabled;
    })
    .map((it) => {
      return it.price;
    })
    .reduce((total, value) => {
      return total + value;
    }, 0);

    finalAmount += amount;
};

for (const waypoint of waypoints) {
  getFinalAmount(waypoint)
}

const pageBody = document.querySelector(`.page-body`);
const header = pageBody.querySelector(`.page-header`);
const tripMainContainer = header.querySelector(`.trip-main`);
const tripControls = tripMainContainer.querySelector(`.trip-controls`);
const firstTitleTripControls = tripControls.querySelector(`h2`);
const main = pageBody.querySelector(`.page-main`);
const tripEventsContainer = main.querySelector(`.trip-events`);


render(tripMainContainer, RenderPosition.AFTERBEGIN, new TripInfoView (uniqueDatesSet, citiesForInfo, finalAmount).getElement());
render(firstTitleTripControls, RenderPosition.AFTEREND, new TripTabsView ().getElement());
render(tripControls, RenderPosition.BEFOREEND, new TripFiltersView ().getElement());

if (COUNT_WAYPOINTS) {
  render(tripEventsContainer, RenderPosition.BEFOREEND, new TripSortView ().getElement());
} else {
  render(tripEventsContainer, RenderPosition.AFTERBEGIN, new NoWaypointsView ().getElement());
}


const daysContainer = new DaysView ().getElement();

render(tripEventsContainer, RenderPosition.BEFOREEND, daysContainer);


if (daysContainer) {
  let i = 1;
  for (let value of uniqueDatesSet) {
    render(daysContainer, RenderPosition.BEFOREEND, new OneDayView (i++, value).getElement());
  }
}

const addWaypoint = (waypoint) => {
  const waypointEdit = new EventView (uniqueCitiesDatalist, waypoint);
  const waypointComponent = new WaypointView (waypoint);

  const startTime = new Date (waypoint.time.startTime).getTime() + THREE_HOURS_IN_MS;
  const time = new Date (startTime).toISOString().substr(0,10);
  
  const selector = daysContainer.querySelector(`[data-start-date="${time}"] > .trip-events__list`);

  const replaceFormToCard = () => {
    selector.replaceChild(waypointEdit.getElement(), waypointComponent.getElement());
  };

  const replaceCardToForm = () => {
    selector.replaceChild(waypointComponent.getElement(), waypointEdit.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceCardToForm();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  waypointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceFormToCard();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  waypointEdit.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceCardToForm();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  waypointEdit.getElement().addEventListener(`reset`, (evt) => {
    evt.preventDefault();
    replaceCardToForm();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  if (selector) {
    render(selector, RenderPosition.BEFOREEND, waypointComponent.getElement());
  }
};

for (let i = 0; i < COUNT_WAYPOINTS; i++) {
  addWaypoint(waypoints[i]);
}
