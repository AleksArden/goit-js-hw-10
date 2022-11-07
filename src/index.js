import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetch-countries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
let getRef = x => document.querySelector(x);

getRef("#search-box").addEventListener('input',
    debounce(onSearchCountries, DEBOUNCE_DELAY))

function onSearchCountries(e) {
    const inputCountry = e.target.value;
    if (inputCountry === '') {
        getRef('.country-list').innerHTML = "";
        return
    }

    console.log(inputCountry.trim());
    fetchCountries(inputCountry.trim())
        .then((data) => {
            console.log(data);
            const elements = makeCountriesListMarkup(data);

            if (data.length > 1 && data.length < 11) {
                return getRef('.country-list').innerHTML = elements;
            }
            if (data.length === 1) {
                return getRef(".country-info").innerHTML = elements;
            }

        })
        .catch(error => Notiflix.Notify.failure("Oops, there is no country with that name"))
}

function makeCountriesListMarkup(data) {
    console.log(data);
    console.log(data.length);
    if (data.length > 10) {
        getRef('.country-list').innerHTML = "";
        getRef(".country-info").innerHTML = ""
        if (data.length > 10 && getRef('.country-list') === '') {
            return
        }
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        return
    }
    if (data.length > 1 && data.length < 11) {
        getRef(".country-info").innerHTML = "";
        return data.map(({ name, flags }) =>
            `<li class="country-list__item"><img class="country-list__img" src="${flags.svg}" /><h2 class="country-list__name">${name.common}</h2></li>`
        ).join('')
    }
    if (data.length === 1) {
        getRef('.country-list').innerHTML = "";
        return data.map(({ name, capital, flags, population, languages }) => {
            return createElementDiv(name.official, capital, flags.svg, population, languages)
        })
        // getInformationCountry(date)

    }
}
// function createElementLi(name, flags) {
//     li = document.createElement('li');
//     img = document.createElement('img');
//     h2 = document.createElement('h2');
//     li.classList.add('country-list__item')
//     img.src = `${flags}`;
//     img.style.width = 100 + 'px';
//     h2.textContent = `${name}`
//     h2.style.fontSize = 24 + 'px';
//     li.append(img);
//     li.append(h2);
//     // console.log(li);
//     return li;
// }

// function createElementDiv(name, capital, flags, population, languages) {
//     // capital = capital.join('');
//     console.log(capital);
//     languages = Object.values(languages).join(', ');

//     div = document.createElement('div');
//     img = document.createElement('img');
//     h2 = document.createElement('h2');
//     p = document.createElement('p');


//     img.src = `${flags}`;
//     img.style.width = 150 + 'px';
//     h2.textContent = `${name}`
//     h2.style.fontSize = 30 + 'px';
//     p.textContent = `Capital: ${capital}`;

//     div.append(img);
//     div.append(h2);
//     div.append(p);

//     console.log(div);
//     return div;


// }
