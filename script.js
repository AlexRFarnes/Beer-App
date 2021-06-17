const URL_BASE = 'https://api.punkapi.com/v2/beers?page=';

const beersContainer = document.querySelector('[data-beers]');
const beerTemplate = document.querySelector('#beer-template');
const filterABV = document.querySelector('#filterABV');
const filterIBU = document.querySelector('#filterIBU');
const pageText = document.getElementById('pageNumber');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
let optionsABV = '';
let optionsIBU = '';
let page = 1;

filterABV.addEventListener('change', e => {
  const value = e.target.value;

  switch (value) {
    case 'all':
      optionsABV = '';
      break;
    case 'weak':
      optionsABV = '&abv_lt=4.6';
      break;
    case 'medium':
      optionsABV = '&abv_gt=4.5&abv_lt=7.6';
      break;
    case 'strong':
      optionsABV = '&abv_gt=7.5';
      break;
  }
  //   Everytime there is a filter reset to page 1
  page = 1;
  getBeers();
});

filterIBU.addEventListener('change', e => {
  const value = e.target.value;

  switch (value) {
    case 'all':
      optionsIBU = '';
      break;
    case 'weak':
      optionsIBU = '&ibu_lt=35';
      break;
    case 'medium':
      optionsIBU = '&ibu_gt=34&ibu_lt=75';
      break;
    case 'strong':
      optionsIBU = '&ibu_gt=74';
      break;
  }
  //   Everytime there is a filter reset to page 1
  page = 1;
  getBeers();
});

async function getBeers() {
  const url = `${URL_BASE}${page}${optionsABV}${optionsIBU}`;

  const res = await fetch(url);
  const beers = await res.json();
  if (beers.length === 0) {
    nextPage.disabled = true;
    page--;
    return;
  }

  beersContainer.innerHTML = '';
  //   pagination
  pagination(beers.length);

  beers.forEach(beer => {
    const beerContainer = generateBeerTemplate(beer);
    beersContainer.append(beerContainer);
  });
}

function generateBeerTemplate(beer) {
  const genericBottle =
    'https://cdn.pixabay.com/photo/2014/12/22/00/04/bottle-576717_960_720.png';
  const beerContainer = beerTemplate.content.cloneNode(true);
  const name = beerContainer.querySelector('[data-beer-name]');
  name.innerText = beer.name;
  const img = beerContainer.querySelector('[data-beer-img]');
  img.src = beer.image_url || genericBottle;
  img.alt = beer.name;
  const beerAbv = beerContainer.querySelector('[data-beer-abv]');
  beerAbv.innerText = `ABV: ${beer.abv}%`;
  const beerIbu = beerContainer.querySelector('[data-beer-ibu]');
  beerIbu.innerText = `IBU: ${beer.ibu}`;
  const nameContent = beerContainer.querySelector('[data-beer-name-content]');
  nameContent.innerText = beer.name;
  const tagline = beerContainer.querySelector('[data-beer-tagline]');
  tagline.innerText = beer.tagline;
  const description = beerContainer.querySelector('[data-beer-description]');
  description.innerText = beer.description;
  const pairing = beerContainer.querySelector('[data-beer-pairing]');
  pairing.innerText = `Pair with: ${beer.food_pairing.join(', ')}`;

  return beerContainer;
}

function pagination(numBeers) {
  pageText.innerText = page;
  if (page === 1) {
    prevPage.disabled = true;
  } else {
    prevPage.disabled = false;
  }
  if (numBeers < 25) {
    nextPage.disabled = true;
  } else {
    nextPage.disabled = false;
  }
}

getBeers();

prevPage.addEventListener('click', () => {
  page--;
  getBeers();
});

nextPage.addEventListener('click', () => {
  page++;
  getBeers();
});
