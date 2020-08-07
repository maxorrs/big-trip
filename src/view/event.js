const createPhoto = (photos) => {
  let result = ``;

  for (const photo of photos) {
    result += `<img class="event__photo" src="${photo}" alt="Event photo">`;
  }

  return result;
};

const getDatalist = (uniqueCitiesDatalist) => {
  let result = ``;
  for (const city of uniqueCitiesDatalist.keys()) {
    result += `<option value="${city}"></option>`;
  }

  return result;
};

const remakeDate = (date) => {
  const mounthValue = new Date(date).toISOString().substr(5, 2);
  const dateValue = new Date(date).toISOString().substr(8, 2);
  const yearValue = new Date(date).toISOString().substr(2, 2);
  const timeValue = new Date(date).toISOString().substr(11, 5);

  return `${dateValue}/${mounthValue}/${yearValue} ${timeValue}`;
};

const getSumPrice = (item) => {
  const result = Object
  .values(item.offers)
  .filter((it) => {
    return it.isEnabled === true;
  }).map((it) => {
    return it.price;
  })
  .reduce((total, value) => {
    return total + value;
  }, 0);

  return result;
};

const setOffers = (item) => {
  const offersEnabled = Object
  .values(item.offers)
  .filter((it) => {
    return it;
  });

  const offersChecked = {
    luggage: offersEnabled[0].isEnabled ? `checked` : ``,
    comfort: offersEnabled[1].isEnabled ? `checked` : ``,
    meal: offersEnabled[2].isEnabled ? `checked` : ``,
    seats: offersEnabled[3].isEnabled ? `checked` : ``,
    train: offersEnabled[4].isEnabled ? `checked` : ``
  };

  return offersChecked;
};

export const createEventTemplate = (uniqueCitiesDatalist, waypoint) => {
  const city = waypoint.city;
  const {description, photos} = waypoint.destination;
  const photo = createPhoto(photos);
  const {startTime, endTime} = waypoint.time;
  const startTimeValue = remakeDate(startTime);
  const endTimeValue = remakeDate(endTime);
  const type = waypoint.type === `Check` ? `Check-in` : waypoint.type;

  const sumPrice = getSumPrice(waypoint);

  const datalist = getDatalist(uniqueCitiesDatalist);

  const offersChecked = setOffers(waypoint);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
              <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
            </div>
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>

            <div class="event__type-item">
              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type} to
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${datalist}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTimeValue}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTimeValue}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${sumPrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${offersChecked.luggage}>
        <label class="event__offer-label" for="event-offer-luggage-1">
          <span class="event__offer-title">Add luggage</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">40</span>
        </label>
      </div>
    
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" ${offersChecked.comfort}>
        <label class="event__offer-label" for="event-offer-comfort-1">
          <span class="event__offer-title">Switch to comfort class</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">100</span>
        </label>
      </div>
    
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal" ${offersChecked.meal}>
        <label class="event__offer-label" for="event-offer-meal-1">
          <span class="event__offer-title">Add meal</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">15</span>
        </label>
      </div>
    
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats" ${offersChecked.seats}>
        <label class="event__offer-label" for="event-offer-seats-1">
          <span class="event__offer-title">Choose seats</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">5</span>
        </label>
      </div>
    
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train" ${offersChecked.train}>
        <label class="event__offer-label" for="event-offer-train-1">
          <span class="event__offer-title">Travel by train</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">40</span>
        </label>
      </div>
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${photo}
          </div>
        </div>
      </section>
    </section>
  </form>`
  );
};
