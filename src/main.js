'use strict';

import {generateWaypoint} from './mock/waypoint.js';
import {defaultSortWaypoints} from './utils/waypoint.js';
import {COUNT_WAYPOINTS, MenuItem, UpdateType, FilterType} from './consts.js';
import InfoPresenter from './presenter/info.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js'
import WaypointsModel from './model/waypoints.js';
import FilterModel from './model/filter.js';
import StatisticsView from './view/statistics.js';

import {RenderPosition, render, remove} from './utils/render.js';

const sitePageBody = document.querySelector(`.page-body`);
const sitePageBodyContainer = document.querySelector(`.page-body__page-main .page-body__container`);

const waypoints = new Array(COUNT_WAYPOINTS)
  .fill()
  .map(generateWaypoint)
  .sort(defaultSortWaypoints);

const waypointsModel = new WaypointsModel();
waypointsModel.setWaypoints(waypoints);

const filterModel = new FilterModel();

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch(menuItem) {
    case MenuItem.TABLE:
      infoPreseter.destroyFormNewWaypoint();
      tripPresenter.destroy();
      tripPresenter.init();
      infoPreseter.setMenuItemTable();
      if (statisticsComponent !== null) {
        remove(statisticsComponent);
        statisticsComponent = null;
      }
      
      break;
    case MenuItem.STATS:
      infoPreseter.destroyFormNewWaypoint();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.destroy();
      infoPreseter.setMenuItemStats();
      if (statisticsComponent === null) {
        statisticsComponent = new StatisticsView(waypointsModel.getWaypoints());
        render(sitePageBodyContainer, RenderPosition.BEFOREEND, statisticsComponent);
      }
      
      break;
    case MenuItem.ADD_WAYPOINT:
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      infoPreseter.createFormNewWaypoint();
      infoPreseter.setMenuItemTable();
      if (statisticsComponent !== null) {
        remove(statisticsComponent);
        statisticsComponent = null;
      }

      break;
  }
}
const filterPresenter = new FilterPresenter(sitePageBody, filterModel, waypointsModel);
const tripPresenter = new TripPresenter(sitePageBody, waypointsModel, filterModel);
const infoPreseter = new InfoPresenter(sitePageBody, waypointsModel, tripPresenter, handleSiteMenuClick);

infoPreseter.init();
filterPresenter.init();
tripPresenter.init();
