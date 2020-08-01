'use strict';

const COUNT_WAYPOINTS = 3;

import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripTabsTemplate} from './view/trip-tabs.js';
import {createTripFiltersTemplate} from './view/trip-filters.js';
import {createTripSortTemplate} from './view/trip-sort.js';
import {createEventTemplate} from './view/event.js';
import {createDaysContainerTemplate} from './view/days.js';
import {createOneDayTemplate} from './view/one-day.js';
import {createWaypointTemplate} from './view/waypoint.js';

const render = (container, place, template) => {
  container.insertAdjacentHTML(place, template);
};

const pageBody = document.querySelector(`.page-body`);
const header = pageBody.querySelector(`.page-header`);
const tripMainContainer = header.querySelector(`.trip-main`);
const tripControls = tripMainContainer.querySelector(`.trip-controls`);
const firstTitleTripControls = tripControls.querySelector(`h2`);

render(tripMainContainer, `afterBegin`, createTripInfoTemplate());
render(firstTitleTripControls, `afterEnd`, createTripTabsTemplate());
render(tripControls, `beforeEnd`, createTripFiltersTemplate());

const main = pageBody.querySelector(`.page-main`);
const tripEventsContainer = main.querySelector(`.trip-events`);

render(tripEventsContainer, `beforeEnd`, createTripSortTemplate());

render(tripEventsContainer, `beforeEnd`, createEventTemplate());

render(tripEventsContainer, `beforeEnd`, createDaysContainerTemplate());

const daysContainer = tripEventsContainer.querySelector(`.trip-days`);

if (daysContainer) {
  render(daysContainer, `beforeEnd`, createOneDayTemplate());
}

const tripEventsList = tripEventsContainer.querySelector(`.trip-events__list`);

if (tripEventsList) {
  for (let i = 0; i < COUNT_WAYPOINTS; i++) {
    render(tripEventsList, `beforeEnd`, createWaypointTemplate());
  }
}
