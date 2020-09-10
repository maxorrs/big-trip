import FilterView from '../view/trip-filters.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../consts.js';

export default class Filter {
  constructor(filterContainer, filterModel, waypointsModel) {
    this._filterContainer = filterContainer.querySelector(`.trip-controls`);
    this._filterModel = filterModel;
    this._waypointsModel = waypointsModel;
    this._currentFilter = null;
    this._disableFilters = false;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._waypointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    const filters = this._getFilters();

    const prevFilterComponent = this._filterComponent;
    this._filterComponent = new FilterView(filters, this._currentFilter, this._disableFilters);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, RenderPosition.BEFOREEND, this._filterComponent);
      return;
    }

    this._resetFilterIfEmpty(filters);

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  disableFilters() {
    this._disableFilters = true;
  }

  enableFilters() {
    this._disableFilters = false;
    this.init();
  }

  _resetFilterIfEmpty(filters) {
    const currentFilterData = Object.values(filters).filter((filt) => filt.type === this._currentFilter);

    if (currentFilterData[0].count === 0 && currentFilterData[0].type !== FilterType.EVERYTHING) {
      this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    }
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === null) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const waypoints = this._waypointsModel.getWaypoints();
    return [
      {
        type: FilterType.EVERYTHING,
        name: `Everything`,
        count: filter[FilterType.EVERYTHING](waypoints).length
      },
      {
        type: FilterType.FUTURE,
        name: `Future`,
        count: filter[FilterType.FUTURE](waypoints).length
      },
      {
        type: FilterType.PAST,
        name: `Past`,
        count: filter[FilterType.PAST](waypoints).length
      }
    ];
  }
}
