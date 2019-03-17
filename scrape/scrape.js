const rp = require('request-promise');
const cheerio = require('cheerio');
const _  = require('lodash');
var fs = require('fs');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBBJCkfY2hvbCJSbjsMEgvo0eKln24LYcA',
  Promise: Promise
});
const fetch = require('node-fetch');

const headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'}

const eventDivSelector = '.archive_node-summary-wrapper';

function getEventDivs(html) {
	const $ = cheerio.load(html)
	return $('.archive_node-summary-wrapper')
}

function getUniqueVenueURLs(events) {
	// events is an array of dicts with a venueURL attribute
	allVenues = [];
	events.forEach(function(event, i) {
		const venueURL = event.venueURL;
		allVenues[i] = venueURL;
	})
	return new Promise (resolve => resolve( _.uniq(allVenues) ) )
}

function rpOptions(url) {
	return {
	    uri: url,
	    transform: function (body) {
	        return cheerio.load(body);
	    }
	};
}

// function to get events HTML for date
async function getEvents(date) {
	// date is optional. if not supplied, it will get today's gigs
	// if date is supplied, needs to be in YYYY-MM-DD string format
	let dateString = ''

	if (date === undefined) {
		dateString = ''
	} else {
		dateString = formatDate(date);
	};
	const dateURL = 'http://www.beat.com.au/gig-guide/' + dateString;

	let events = [];
	
	return rp(rpOptions(dateURL)).then(function($) {
		const eventDivs = $(eventDivSelector);
		eventDivs.each(function(i, event) {
			events[i] = parseEvent($, event)
		})
		return events
	})
}

function makeJSON(array, type) {
	arrayJSON = JSON.stringify(array)
	filename = type + '.json'
	fs.writeFile(filename, arrayJSON, function(err) {
		if (err) {
			console.log(err);
		}
	})
	console.log("wrote file: " + filename);
	return arrayJSON
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function daysBetween(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = addDays(currentDate, 1);
    }
    return dateArray;
}

// getEvents()
// .then(events => {
// 	eventsJSON = makeJSON(events, 'events')
// 	return getUniqueVenueURLs(events)
// })
// .then(venueURLs => {
// 	return parseVenues(venueURLs)
// })
// .then(venues => {
// 	venuesJSON = makeJSON(venues, 'venues')
// });

var today = new Date();
var sixDaysAway = addDays(today, 6);

var dates = daysBetween(today, sixDaysAway);

async function dayEvents(dates) {
	return Promise.all(
		dates.map(
			async date => await getEvents(date)
			)
		)
}

let rawdata = fs.readFileSync('venues.json');  
let existingVenues = JSON.parse(rawdata);
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




// const existingVenueURLs = existingVenues.map(venue => venue.venueURL);

// console.log("EXISTING")
// console.log(existingVenues.length)

// dayEvents(dates)
// .then(arraysOfEvents => {
// 	return arraysOfEvents.reduce((acc, val) => acc.concat(val))
// })
// .then(events => {
// 	const eventsJSON = makeJSON(events, 'events2')
// 	return getUniqueVenueURLs(events)
// })
// .then(venueURLs => {
// 	console.log("NEW")
// 	console.log(venueURLs.length)
// 	return compareVenues(existingVenueURLs, venueURLs)
// })
// .then(newURLs => {
// 	return parseVenues(newURLs)
// })
// .then(newVenues => {
// 	const allVenues = existingVenues.concat(newVenues);
// 	const venuesJSON = makeJSON(allVenues, 'venues')

// })

function compareVenues(existingVenues, venues) {
	const newVenues = venues.filter(url => {
		if (!(existingVenues.includes(url))) {
			return url
		}
	})
	console.log(newVenues.length + " new venues")
	console.log(newVenues)
	return newVenues;
}



function formatDate(date) {
    var mm = '' + (date.getMonth() + 1)
    var dd = '' + date.getDate()
    var yyyy = date.getFullYear()

    if (mm.length < 2) mm = '0' + mm;
    if (dd.length < 2) dd = '0' + dd;

    return [yyyy, mm, dd].join('-');
}



// YYYY-MM-DD


 // we need to:
 // - get events for next 5 days. okay to rewrite data - 5 requests to beat mag is fine.
 // - get existing venue urls
 // - for the new events, get unique venue urls
 // - for each venue url that's not in the existing list, parse them and add them to the list
 // 
 //
 //
 //




// function get individual event info
function parseEvent($, event) {
	// event needs to be the wrapper JQuery element
	// return a dict with: title, venueId, genre, date, region, price, infolink

	return {
		title: $(event).find('h3').text(),
		venueURL: 'http://www.beat.com.au' + $(event).find('h5').eq(1).find('a').attr('href'),
		venueName: $(event).find('h5').eq(1).text(),
		genre: $(event).attr('class').split(' ').pop(),
		date: new Date($(event).find('.sidebar_gig-date.day').text() + ' ' + $(event).find('.sidebar_gig-date.month').text()),
		region: $(event).find('h5').eq(2).text(),
		price: $(event).find('h5').eq(3).text(),
		slug: $(event).find('h3 a').attr('href'),
		infoLink: ('http://www.beat.com.au' + $(event).find('h3 a').attr('href'))
	}
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

async function parseVenues(venueURLs) {
	// venueURLs is a list of strings
	return Promise.all(
		venueURLs.map(
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
	        return 'error ' + venueURL;
		});


}

