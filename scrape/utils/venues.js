const rpOptions = require("./html")
const googleMaps = require("@google/maps")
const rp = require('request-promise')
const uniq = require('lodash.uniq')

const googleMapsClient = googleMaps.createClient({
  key: 'AIzaSyBBJCkfY2hvbCJSbjsMEgvo0eKln24LYcA',
  Promise: Promise
});

async function parseVenues(venueURLs) {
	// venueURLs is a list of strings
	return Promise.all(
		venuesMap = venueURLs.map(
			async url => await parseVenue(url)
			)
		)
}

async function parseVenue(venueURL) {
	// html is the html of the venue page

	const venueOptions = rpOptions(venueURL);

	return rp(venueOptions).then(async ($) => {
		const name = $('h1.article_title').eq(0).text();
		const address = $('.gigguide_node-summary-detail').eq(0).text();
		const coords = await getCoords(address);
		const website = $('.gigguide_gigdetail-details a').eq(0).attr('href');
		return {
			name,
			venueURL,
			address,
			coords,
			website
			}
		})
	   .catch(function (err) {
	    // API call failed...
	    	console.log("error: " + venueURL)
	        return {venueURL};
		});
}

async function getCoords(address) {
	// address is a string to lookup on Google
	return googleMapsClient.geocode({address: address})
		.asPromise()
		.then(response => {
			return response.json.results[0].geometry.location
		})
		.catch(err => {
			return 'err'
		});
}

function compareVenues(existingVenues, venues) {
	console.log(existingVenues.length + " existing venues")
	const newVenues = venues.filter(url => {
		if (!(existingVenues.includes(url))) {
			return url
		}
	})
	console.log(newVenues.length + " new venues")
	return newVenues;
}

function deleteInvalidVenues() {
	let venuesFile = fs.readFileSync('venues.json');  
	let existingVenues = JSON.parse(venuesFile);
	console.log("BEFORE: EXISTING VENUES LENGTH: " + existingVenues.length)

	const toDelete = existingVenues.filter(venue => (venue.name === undefined))

	console.log(toDelete)

	toDelete.forEach(venue => {

		let idx = existingVenues.indexOf(venue)
		if (idx > -1) {
			console.log("removing " + venue)
			existingVenues.splice(idx, 1)
		}
	})

	console.log("AFTER: EXISTING VENUES LENGTH: " + existingVenues.length)
	const venuesJSON = makeJSON(existingVenues, 'venues3')
}

function getUniqueVenueURLs(events) {
	// events is an array of dicts with a venueURL attribute
	return uniq(
		events.map(event => event.venueURL)
	)
}

module.exports = {
	getUniqueVenueURLs,
	compareVenues,
	parseVenues}
