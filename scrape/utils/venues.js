const rpOptions = require("./html");
const googleMaps = require("@google/maps");
const rp = require("request-promise");
const uniq = require("lodash.uniq");

const config = require("../config");

const googleMapsClient = googleMaps.createClient({
  key: process.env.REACT_APP_MAP_KEY,
  Promise: Promise
});

async function parseVenues(venueURLs) {
  // venueURLs is a list of strings
  return Promise.all(
    (venuesMap = venueURLs.map(async url => await parseVenue(url)))
  );
}

async function parseVenue(venueURL) {
  // html is the html of the venue page

  return rp(rpOptions(venueURL))
    .then(async $ => {
      let venueObj = { venueURL };
      config.venuePage.fields.forEach(field => {
        if (field.get($)) {
          venueObj[field.name] = field.get($);
        }
      });

      if (venueObj.address) {
        venueObj.coords = await getCoords(venueObj.address);
			}
			
			return venueObj
    })
    .catch(function(err) {
      // API call failed...
      console.log("error: " + venueURL);
      return { venueURL };
    });
}

async function getCoords(address) {
  // address is a string to lookup on Google
  return googleMapsClient
    .geocode({ address: address })
    .asPromise()
    .then(response => {
      return response.json.results[0].geometry.location;
    })
    .catch(err => {
      return undefined;
    });
}

function compareVenues(existingVenues, venues) {
  console.log(existingVenues.length + " existing venues");
  const newVenues = venues.filter(url => {
    if (!existingVenues.includes(url)) {
      return url;
    }
  });
  console.log(newVenues.length + " new venues");
  return newVenues;
}

function deleteInvalidVenues() {
  let venuesFile = fs.readFileSync("venues.json");
  let existingVenues = JSON.parse(venuesFile);
  console.log("BEFORE: EXISTING VENUES LENGTH: " + existingVenues.length);

  const toDelete = existingVenues.filter(venue => venue.name === undefined);

  console.log(toDelete);

  toDelete.forEach(venue => {
    let idx = existingVenues.indexOf(venue);
    if (idx > -1) {
      console.log("removing " + venue);
      existingVenues.splice(idx, 1);
    }
  });

  console.log("AFTER: EXISTING VENUES LENGTH: " + existingVenues.length);
  const venuesJSON = makeJSON(existingVenues, "venues3");
}

function getUniqueVenueURLs(events) {
  // events is an array of dicts with a venueURL property
  return uniq(events.map(event => event.venueURL));
}

module.exports = {
  getUniqueVenueURLs,
  compareVenues,
  parseVenues
};
