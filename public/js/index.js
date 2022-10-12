// Add google maps to page
var map;
var service;
var infowindow;

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) {
    return;
  }

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, 'click', () => {
    console.log(place.name);
    infowindow.setContent(place.name || '');
    infowindow.open({
      anchor: marker,
      shouldFocus: false,
    });
  });
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function initMap() {
  var pyrmont = new google.maps.LatLng(52.48753, -1.94903);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 14,
  });

  var request = {
    location: pyrmont,
    radius: '1000',
    type: ['supermarket'],
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

let address1Field;
let address2Field;
let postalField;
// let city;
let autocomplete;
// let latitude;
// let longitude;

async function fillInAddress() {
  // Get the place details from the autocomplete object.
  const place = await autocomplete.getPlace();
  let address1 = '';
  let postcode = '';

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  for (const component of place.address_components) {
    // @ts-ignore remove once typings fixed
    const componentType = component.types[0];

    switch (componentType) {
      case 'street_number': {
        address1 = `${component.long_name} ${address1}`;
        break;
      }

      case 'route': {
        address1 += component.short_name;
        break;
      }

      case 'postal_code': {
        postcode = `${component.long_name}${postcode}`;
        break;
      }

      case 'postal_code_suffix': {
        postcode = `${postcode}-${component.long_name}`;
        break;
      }
      case 'locality':
        document.querySelector('#locality').value = component.long_name;
        break;
      case 'postal_town':
        document.querySelector('#locality').value = component.long_name;
        break;

      case 'country':
        document.querySelector('#country').value = component.long_name;
        break;
      default:
        break;
    }
  }
  // latitude = place.geometry.location.lat();
  // longitude = place.geometry.location.lng();
  address1Field.value = address1;
  postalField.value = postcode;
  // After filling the form with address components from the Autocomplete
  // prediction, set cursor focus on the second address line to encourage
  // entry of subpremise information such as apartment, unit, or floor number.
  address2Field.focus();
}

// Suggest address and autocomplete form.
function autocompleteFunc() {
  address1Field = document.querySelector('#firstLineAddress');
  address2Field = document.querySelector('#address-line-2');
  postalField = document.querySelector('#postcode');
  const input = document.getElementById('firstLineAddress');
  const options = {
    componentRestrictions: { country: 'uk' },
    fields: ['address_components', 'geometry'],
    strictBounds: false,
    types: ['address'],
  };
  autocomplete = new google.maps.places.Autocomplete(input, options);

  address1Field.focus();
  autocomplete.addListener('place_changed', fillInAddress);
}

if (window.location.pathname.includes('/about-property/')) {
  initMap();

  const datePicker = function () {
    var dates = ['2022-08-10', '2022-08-15', '2022-08-19'];
    function disableDates(date) {
      var string = $.datepicker.formatDate('yy-mm-dd', date);
      return [dates.indexOf(string) == -1];
    }

    $('#startingDate').datepicker({
      beforeShowDay: disableDates,
      dateFormat: 'yy-mm-dd',
    });

    // $('#startingDate').datepicker({
    //   dateFormat: 'yy-mm-dd',
    //   minDate: 0,
    //   maxDate: 365,
    // });
    $('#endDate').datepicker({
      dateFormat: 'yy-mm-dd',
      selectOtherMonths: true,
      showWeek: true,
      changeMonth: true,
      changeYear: true,
      // minDate: 31,
      maxDate: 365,
    });
  };
  $(datePicker);
  datePicker();

  // Query for expanding and contracting text area in description page
  var h = $('#property-description')[0].scrollHeight;

  $('#more').click(function () {
    $('#property-description').animate({
      height: h,
    });
    $('#property-description').animate({
      height: 'fit-content',
    });
    $('#less').css('display', 'block');
    $('#more').css('display', 'none');
  });

  $('#less').click(function () {
    $('#property-description').animate({
      height: '200px',
    });
    $('#less').css('display', 'none');
    $('#more').css('display', 'block');
  });

  let bookingForm = document.getElementById('bookingCalender');
  bookingForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const dates = new FormData(bookingForm);
    const formProps = Object.fromEntries(dates);

    var baseUrl = window.location.href;
    var propertyId = baseUrl.substring(baseUrl.lastIndexOf('/') + 1);

    console.log(formProps);

    const response = await fetch(`/api/bookings/${propertyId}`, {
      method: 'POST',
      body: JSON.stringify(formProps),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(response);
  });
}

async function exchange() {
  let propertyAvailability = $('#flexSwitchCheckChecked');
  let available = propertyAvailability.prop('checked');
  propertyAvailability.prop('value', available).prop('value');
}

// Sign Out
async function signOut() {
  try {
    const response = await fetch('/auth/signOut', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Error in POST request:', error);
  }
}

const fetchCities = async () => {
  const response = await fetch('/api/property/by/cities', {
    method: 'GET', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
  });
  let data = await response.json();
  let result = data.map((a) => a.city);
  return result;
};

$(async function () {
  let cities = await fetchCities();
  var availableTags = cities;
  $('#tags').autocomplete({
    source: availableTags,
  });
  $('#suggestionBox').click(function () {
    let valueCity = $('#tags').val();
    window.location.href = `/search-page/${valueCity}`;
  });
});

// Updating
let bookmarkIcon = $('.bookmark-icon');
if (bookmarkIcon) {
  bookmarkIcon.click(async function () {
    let value = $(this).parent().attr('property-id');
    const bookmark = await fetch('/api/bookmark', {
      method: 'POST',
      body: JSON.stringify({ property_id: value }),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(bookmark);
  });
}
// Updating
let removeBookmarkIcon = $('.removeBookmark-icon');
if (removeBookmarkIcon) {
  removeBookmarkIcon.click(async function () {
    let value = $(this).parent().attr('property-id');
    const bookmark = await fetch('/api/bookmark', {
      method: 'DELETE',
      body: JSON.stringify({ property_id: value }),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(bookmark);
  });
}

// Search page
if (window.location.pathname.includes('/search-page')) {
  let filterButton = $('.search-filter');

  if (filterButton) {
    filterButton.on('click', function (e) {
      let sortByOption = e.target.getAttribute('option');

      let location = window.location.pathname;
      console.log(sortByOption);
      window.location.href = location + '?sortBy=' + sortByOption;
    });
  }
}

const updateAvailablilty = (e) => {
  let availability = e.getAttribute('value');
  console.log('inside');

  if (availability < 0) {
    console.log('less');
    e.setAttribute('value', 1);
    // update availability
    return;
  }
  e.setAttribute('value', -1);
};

if (window.location.pathname.includes('/user-profile')) {
  const updateUserDetailsForm = document.getElementById('updateUserDetails');
  updateUserDetailsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPropertyFormFields = new FormData(updateUserDetailsForm);
    const formProps = Object.fromEntries(newPropertyFormFields);
    console.log(formProps);
    try {
      const response = await fetch('/api/user/', {
        method: 'PUT',
        body: JSON.stringify(formProps),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        location.reload();
      }
    } catch (error) {
      console.error('Error in PUT request:', error);
    }
  });
}

const initializeLS = () => {
  // Calling the schedule array from the local storage
  const currencyTypeLS = localStorage.getItem('currencyType');

  // If the array is undefined, we create an empty array and push it to the local storage
  if (!currencyTypeLS) {
    localStorage.setItem('currencyType', 'GBP');
  }
};

initializeLS();

let currencyTypeEl = $('#currencyType');

currencyTypeEl.change(async function () {
  let newCurrency = currencyTypeEl.val();
  localStorage.setItem('currencyType', newCurrency);
  try {
    const response = await fetch('/api/property/currencyType', {
      method: 'POST',
      body: JSON.stringify({ currency: newCurrency }),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(response);
  } catch (error) {
    console.error('Error in POST request:', error);
    return;
  }
});

// Creating carrousell

let carousel = document.getElementsByClassName('carousel')[0];
let cardEl = document.getElementsByClassName('custom-property-card')[0];
let carouselIndex = window
  .getComputedStyle(carousel)
  .getPropertyValue('--carousel--index');

let trendsContainerEl = document.getElementById('trends-container');
trendsContainerEl.addEventListener('click', function (e) {
  // let carouselIndex;
  let carouselIndex = parseInt(
    e.target.parentElement.getAttribute('iteration')
  );
  // let carouselIndex = parseInt(
  //   window.getComputedStyle(carousel).getPropertyValue('--carousel--index')
  // );
  let cardWidthIndex = parseInt(
    window.getComputedStyle(cardEl).getPropertyValue('--cards--per--index')
  );

  let numberOfcards = 5;
  console.log(carouselIndex);

  let numberOfSwipes = Math.floor(numberOfcards / cardWidthIndex) * 100;

  let currentTarge = e.target;
  if (currentTarge.tagName.toLowerCase() === 'button') {
    if (currentTarge.classList.contains('left-handle')) {
      if (carouselIndex === 0) {
        console.log('test');
        return;
      }
      e.target.parentElement.setAttribute('iteration', carouselIndex - 100);
      // let iterations = carouselIndex * 100;
      e.target.nextElementSibling.style.transform = `translateX(-${
        carouselIndex - 100
      }%)`;
      // carouselIndex--;
      // carousel.style.setProperty('--carousel--index', carouselIndex - 1);
    } else {
      if (carouselIndex === numberOfSwipes) {
        return;
      }
      e.target.parentElement.setAttribute('iteration', carouselIndex + 100);
      e.target.previousElementSibling.style.transform = `translateX(-${
        carouselIndex + 100
      }%)`;
    }
  }
});

//Luke, a 18 yo kid, accidently finds a artifact that bends time and space. After 4 years in college studying theoreitacl time bending physics he figures out a way to control time.
//However, ne doesnt know that everytime he experiments th artefact emits deadly levels of radiation.
//Soon, he finds out and decides to travel to all the events that he always wanted to go and will want to go before his death.
