const GeoJSON = require('geojson');
const fetch = require('node-fetch');
const fs = require('fs');
const WBK = require('wikibase-sdk')
const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
})

const CITIES = require("./cities-civ6.json");
//const CITIES = ["Durocortorum"];
const FETCH_OPTS = {headers: {"User-Agent": "Civ 6 script thingy. Contact work.fechan@gmail.com"}};

async function getLatLng(city) {
  //let url = wdk.searchEntities(city, "en", 1, "json")
  let url = wdk.cirrusSearchPages({ search: city, haswbstatement: 'P17' })
  return await fetch(url, FETCH_OPTS)
    .then(res => res.json())
    .then(results => {
      let qid = results.query.search[0].title;
      let url = wdk.getEntities(qid, "en", "claims", "json", true);
      return fetch(url, FETCH_OPTS)
    })
    .then(res => res.json())
    .then(json => {
      let { entities } = json;
      let simplifiedEntities = wdk.simplify.entities(entities);
      return Object.values(simplifiedEntities)[0]["claims"]["P625"][0];
    })
}

timer = 0;
let sleep = require('util').promisify(setTimeout);

return Promise.allSettled(CITIES.map(async (city) => {
  timer += 500;
  await sleep(timer);
  let [lat, lng] = await getLatLng(city.name);
  console.log({
    "name": city.name,
    "civ": city.civ,
    "lat": lat,
    "lng": lng
  })
  return {
    "name": city.name,
    "civ": city.civ,
    "lat": lat,
    "lng": lng
  }
}))
  .then(promises => promises.filter(promiseOutcome => promiseOutcome.status === "fulfilled"))
  .then(promises => promises.map(promiseOutcome => promiseOutcome.value))
  .then(data => GeoJSON.parse(data, {Point: ['lat', 'lng']}))
  .then(geojson => JSON.stringify(geojson))
  .then(json => fs.writeFileSync("cities-civ6.geojson", json));