'use strict';

import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripTabsTemplate} from './view/trip-tabs.js';
import {createTripFiltersTemplate} from './view/trip-filters.js';
import {createTripSortTemplate} from './view/trip-sort.js';
import {createEventTemplate} from './view/event.js';
import {createDaysContainerTemplate} from './view/days.js';
import {createOneDayTemplate} from './view/one-day.js';
import {createWaypointTemplate} from './view/waypoint.js';
import {generateWaypoint} from './mock/waypoint.js';
import {COUNT_WAYPOINTS} from './consts.js';
import {getRandomInteger} from './util.js';

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
    } else {
      return 0;
    }
  });

const uniqueDate = waypoints
  .slice()
  .map((waypoint) => {
    return waypoint.time.startTime.substr(0,10); 
  });

const uniqueDateSet = new Set (uniqueDate);

const cities = waypoints
  .slice()
  .map((waypoint) => {
    return {
      city: waypoint.city,
      startTime: waypoint.time.startTime
    }
  })
  .sort ((a, b) => {
    const firstDate = new Date(a.startTime).getTime();
    const secondDate = new Date(b.startTime).getTime();
    
    if (firstDate > secondDate) {
      return 1;
    } else if (firstDate < secondDate) {
      return -1;
    } else {
      return 0;
    }
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

const render = (container, place, template) => {
  container.insertAdjacentHTML(place, template);
};

const pageBody = document.querySelector(`.page-body`);
const header = pageBody.querySelector(`.page-header`);
const tripMainContainer = header.querySelector(`.trip-main`);
const tripControls = tripMainContainer.querySelector(`.trip-controls`);
const firstTitleTripControls = tripControls.querySelector(`h2`);

render(tripMainContainer, `afterBegin`, createTripInfoTemplate(uniqueDateSet, citiesForInfo, finalAmount));
render(firstTitleTripControls, `afterEnd`, createTripTabsTemplate());
render(tripControls, `beforeEnd`, createTripFiltersTemplate());

const main = pageBody.querySelector(`.page-main`);
const tripEventsContainer = main.querySelector(`.trip-events`);

render(tripEventsContainer, `beforeEnd`, createTripSortTemplate());

const indexEvent = getRandomInteger(0, waypoints.length - 1);
render(tripEventsContainer, `beforeEnd`, createEventTemplate(uniqueCitiesDatalist, waypoints[indexEvent]));

render(tripEventsContainer, `beforeEnd`, createDaysContainerTemplate());

const daysContainer = tripEventsContainer.querySelector(`.trip-days`);

if (daysContainer) {
  let i = 1;
  for (let value of uniqueDateSet) {
    render(daysContainer, `beforeEnd`, createOneDayTemplate(i++, value));
  }
}

const addWaypoint = (waypoint) => {
  const startTime = new Date (waypoint.time.startTime).getTime() + THREE_HOURS_IN_MS;
  const time = new Date (startTime).toISOString().substr(0,10);
  
  const selector = daysContainer.querySelector(`[data-start-date="${time}"] > .trip-events__list`);
  
  if (selector) {
    render(selector, `beforeEnd`, createWaypointTemplate(waypoint));
  }
};

for (let i = 0; i < COUNT_WAYPOINTS; i++) {
  addWaypoint(waypoints[i]);
}
