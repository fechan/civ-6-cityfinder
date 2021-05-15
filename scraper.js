/**
 * scraper.js scrapes each Civ wiki <civ>_cities_(Civ6) for the table containing the city names of
 * each Civ. You can scrape the URLs from the category containing these using querySelectorAll in
 * browser dev tools.
 */
const fetch = require('node-fetch');
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const CITIES_LINKS = [
  "https://civilization.fandom.com/wiki/American_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Arabian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Australian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Aztec_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Babylonian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Brazilian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Byzantine_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Canadian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Chinese_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Cree_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Dutch_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Egyptian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/English_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Ethiopian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/French_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Gallic_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Georgian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/German_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Gran_Colombian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Greek_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Hungarian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Incan_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Indian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Indonesian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Japanese_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Khmer_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Kongolese_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Korean_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Macedonian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Malian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Mapuche_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Mayan_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Mongolian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/M%C4%81ori_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Norwegian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Nubian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Ottoman_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Persian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Phoenician_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Polish_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Portuguese_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Roman_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Russian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Scottish_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Scythian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Spanish_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Sumerian_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Swedish_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Vietnamese_cities_(Civ6)",
  "https://civilization.fandom.com/wiki/Zulu_cities_(Civ6)"
]

async function fetchCities() {
  allCities = [];
  for (let link of CITIES_LINKS) {
    let cities = await fetch(link)
      .then(res => res.text())
      .then(text => (new JSDOM(text)).window.document)
      .then(parseCityList);
    cities = cities.map(cityName => {
      return {
        "name": cityName.replace(/\[[0-9]\]/, ""), // some table cells have citations on them
        "civ": link.match(/(?<=wiki\/)(.*)(?=_cities)/)[0] // gets "American/Zulu/Cree" from the URL
      }
    })
    allCities = allCities.concat(cities);
  }
  return allCities;
}

function parseCityList(domTree) {
  let cityCells = domTree.querySelectorAll(".article-table tr td:first-child");
  cityCells = Array.from(cityCells);
  cityCells = cityCells.slice(1);
  return cityCells.map(cell => cell.textContent.replace("\n", ""));
}

fetchCities()
  .then(JSON.stringify)
  .then(json => fs.writeFileSync("cities-civ6.json", json));