import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetch-countries';
import Notiflix from 'notiflix';
Notiflix.Notify.init({
    width: "600px",
    fontSize: "28px",
    cssAnimationStyle: "zoom",
    cssAnimationDuration: 600,
    showOnlyTheLastOne: true
});

class Searcher {
    constructor({ refs = { inputRef, listRef, infoCountryRef }, fetchCountries, debounce }) {
        this.inputRef = refs.inputRef;
        this.listRef = refs.listRef;
        this.infoCountryRef = refs.infoCountryRef;
        this.DEBOUNCE_DELAY = 300;
        this.fetchCountries = fetchCountries;
        this.debounce = debounce;

    }
    init() {
        this.addListeners();
    }
    addListeners() {

        this.inputRef.addEventListener(
            'input',
            this.debounce(this.onSearchCountries.bind(this), this.DEBOUNCE_DELAY)
        );
    }
    onSearchCountries(e) {
        const inputCountry = e.target.value;
        if (inputCountry === '') {
            this.clearMarkup();
            return;
        }
        this.fetchCountries(inputCountry.trim())
            .then(this.onResolve.bind(this))
            .catch(this.onReject.bind(this));
    }
    onResolve(data) {
        const elements = this.getCountries(data);

        if (data.length > 1 && data.length < 11) {
            return (this.listRef.innerHTML = elements);
        }
        if (data.length === 1) {
            return (this.infoCountryRef.innerHTML = elements);
        }
    }
    onReject() {
        this.clearMarkup();
        Notiflix.Notify.failure('Oops, there is no country with that name');
    }
    getCountries(data) {
        if (data.length > 10) {
            this.clearMarkup();
            if (data.length > 10 && this.listRef === '') {
                return;
            }
            Notiflix.Notify.info(
                'Too many matches found. Please enter a more specific name.');
            return;
        }
        if (data.length > 1 && data.length < 11) {
            this.clearMarkup();
            return this.makeCountriesListMarkup(data);
        }
        if (data.length === 1) {
            this.clearMarkup();
            return this.makeCountryInfoMarkup(data);
        }
    }
    makeCountriesListMarkup(data) {
        return data
            .map(
                ({ name, flags }) =>
                    `<li class="country-list__item"><img class="country-list__img" src="${flags.svg}" /><h2 class="country-list__name">${name.common}</h2></li>`
            )
            .join('');
    }

    makeCountryInfoMarkup(data) {
        return data
            .map(({ name, capital, flags, population, languages }) => {
                capital = capital.join('');
                languages = Object.values(languages).join(', ');

                return `<div class="country-info__container"><img class="country-info__image" src="${flags.svg}" /><h2 class="country-info__name">${name.official}</h2></div> <p class="country-info__inform"><span class="country-info__inform-bold">Capital:   </span>${capital}</p><p class="country-info__inform"><span class="country-info__inform-bold">Population:   </span>${population}</p><p class="country-info__inform"><span class="country-info__inform-bold">Languages:   </span>${languages}</p>`;
            })
            .join('');
    }
    clearMarkup() {
        this.listRef.innerHTML = '';
        this.infoCountryRef.innerHTML = '';
    }
}

let getRef = x => document.querySelector(x);
const settings = {
    refs: {
        inputRef: getRef('#search-box'),
        listRef: getRef('.country-list'),
        infoCountryRef: getRef('.country-info'),
    },
    fetchCountries,
    debounce,
}
new Searcher(settings).init();
