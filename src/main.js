'use strict';

import {generateWaypoint} from './mock/waypoint.js';
import {defaultSortWaypoints} from './utils/waypoint.js';
import {COUNT_WAYPOINTS} from './consts.js';
import InfoPresenter from './presenter/info.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js'
import WaypointsModel from './model/waypoints.js';
import FilterModel from './model/filter.js';


const sitePageBody = document.querySelector('.page-body');
const waypoints = new Array(COUNT_WAYPOINTS)
  .fill()
  .map(generateWaypoint)
  .sort(defaultSortWaypoints);

const waypointsModel = new WaypointsModel();
waypointsModel.setWaypoints(waypoints);

const filterModel = new FilterModel(); 

const filterPresenter = new FilterPresenter(sitePageBody, filterModel, waypointsModel);
const tripPresenter = new TripPresenter(sitePageBody, waypointsModel, filterModel);
const infoPreseter = new InfoPresenter(sitePageBody, waypointsModel, tripPresenter);

infoPreseter.init();
filterPresenter.init();
tripPresenter.init();

// document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
//   evt.preventDefault();
//   tripPresenter.createWaypoint();
// })