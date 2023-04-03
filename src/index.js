import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBoxRef: document.querySelector('#search-box'),
  countryListRef: document.querySelector('.country-list'),
  countryInfoRef: document.querySelector('.country-info'),
};

refs.searchBoxRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  clearMarkup();
  const name = refs.searchBoxRef.value.trim();
  if (!name) {
    return;
  }
  fetchCountries(name)
    .then(countries => {
      if (countries.length === 1) {
        renderCountryInfoMarkup(countries);
      }
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (countries.length >= 2 && countries.length <= 10) {
        renderCountryListMarkup(countries);
      }
      if (countries.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    })
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearMarkup();
    });
}

function renderCountryListMarkup(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
           <img src="${flags.svg}" alt="Flag of ${name.official}" class="country-list__flag" width="60">
           <p class="country-list__name">${name.official}</p>
         </li>`;
    })
    .join('');
  refs.countryListRef.insertAdjacentHTML('beforeend', markup);
}

function renderCountryInfoMarkup(countries) {
  const markup = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `<div>
        <img src="${flags.svg}" alt="Flag of ${
        name.official
      }" class="country-list__flag" width="60">
        <h1 class="country-info__name">${name.official}</h1>
        <ul class='country-info-list'>
        <li class='country-info-list_item'><b>Capital:</b> ${capital}</li>
        <li class='country-info-list_item'><b>Population:</b> ${population.toLocaleString()}</li>
        <li class='country-info-list_item'><b>Languages:</b> ${Object.values(
          languages
        )}</li>
      </ul>
      </div>`;
    })
    .join('');
  refs.countryInfoRef.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  clearCountryListMarkup();
  clearCountryInfoMarkup();
}

function clearCountryListMarkup() {
  refs.countryListRef.innerHTML = '';
}

function clearCountryInfoMarkup() {
  refs.countryInfoRef.innerHTML = '';
}
