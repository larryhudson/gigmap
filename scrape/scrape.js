const getDaysFromToday = require('./utils/dates')
const {readJSON, makeJSON} = require('./utils/json')
const {dayEvents, parseEventPages, parseEventPage} = require('./utils/events')
const {compareVenues, parseVenues, getUniqueVenueURLs} = require('./utils/venues')
const {combineData, uncombineData} = require('./utils/combine')
const {readJSONfromS3, uploadFiles} = require('./utils/s3')
require('dotenv').config()

const moment = require('moment-timezone')
const AWS = require('aws-sdk')

var s3 = new AWS.S3();

// WHEN STARTING FROM NOTHING: GET ALL EVENTS AND VENUES.
function fromScratch() {
	const dates = getDaysFromToday(7);

	dayEvents(dates)
	.then(events => {
		eventsJSON = makeJSON(events, 'events')
		return getUniqueVenueURLs(events)
	})
	.then(venueURLs => {
		return parseVenues(venueURLs)
	})
	.then(venues => {
		venuesJSON = makeJSON(venues, 'venues')
	});
}

function combineExistingFiles() {
	let existingEvents = readJSON('events.json')
	let existingVenues = readJSON('venues.json')
	
	const {events, venues} = combineData(existingEvents, existingVenues)

	makeJSON(combinedEvents, '../site/src/data/events.json')
	makeJSON(combinedVenues, '../site/src/data/venues.json')
}

function cullOldEvents(events, dates) {
	// only returns events that are within the date range.
	return events.filter(event =>
		dates.includes(
			moment(event.date).format('DD-MM-YYYY')
		)
	)
}

// NEW WAY OF DOING THINGS - GETTING MORE INFO FOR EVENTS
async function main2() {
	console.log(process.env.REACT_APP_MY_NETLIFY_TEST)
	const dates = getDaysFromToday(7)
	
	// only keep events that have dates in our range.
	let eventsFromFile = await readJSONfromS3(s3, 'events')
	const existingEvents = cullOldEvents(eventsFromFile, dates)
	console.log( "culled " + (eventsFromFile.length - existingEvents.length) + " old events" )

	// get new events from web
	const existingEventSlugs = existingEvents.map(({slug}) => slug)
	// get all events from web
	const eventsFromWeb = await dayEvents(dates)
	// work out which events are new
	const newEvents = eventsFromWeb.filter(({slug}) =>
		!( existingEventSlugs.includes(slug) )
	)
	console.log(newEvents.length + " new events")
	// add new events to existing events
	var events = existingEvents.concat(newEvents)
	console.log(events.length + " total events")

	// get info for first 25
	const unscrapedEvents = events.filter(event => !(event.scraped))
	console.log(unscrapedEvents.length + " events to scrape")
	const eventsToScrape = unscrapedEvents.slice(0,50)
	const scrapedEvents = await parseEventPages(eventsToScrape)

	// overwrite old event in array
	scrapedEvents.forEach(newEvent => {
		console.log("scraped event: " + newEvent.slug)
		var eventIndex = events.findIndex(event => { return event.slug === newEvent.slug })
		events[eventIndex] = newEvent
	})

	// log new filter and write new JSON
	console.log(events.filter(e=>e.scraped).length + " scraped events in the events array")

	// *** VENUES *** 
	// get existing venues
	// const downloadedVenues = downloadFile(s3, 'venues')
	// let existingVenues = readJSON('../site/src/data/venues.json')
	let existingVenues = await readJSONfromS3(s3, 'venues')
	const existingVenueURLs = existingVenues.map(venue => venue.venueURL)
	// get all venues from our events
	const venueURLs = getUniqueVenueURLs(events)
	// work out which venues are new
	const newVenueURLs = compareVenues(existingVenueURLs, venueURLs)
	// look up data for the new venues
	const newVenues = await parseVenues(newVenueURLs)
	// add new venues to the old venues
	const venues = existingVenues.concat(newVenues)

	const {combinedEvents, combinedVenues} = combineData(events, venues)
	const makeEventsJSON = await makeJSON(combinedEvents, '../site/src/data/events.json')
	const makeVenuesJSON = await makeJSON(combinedVenues, '../site/src/data/venues.json')
	const uploadedFiles = await uploadFiles(s3)

	// 


}

main2()


// MAIN FUNCTION - GET EVENTS FOR DAYS, GET NEW VENUES AND SAVE BOTH.
async function main() {
	// *** EVENTS *** 
	// get events for the next 7 days.
	const dates = getDaysFromToday(7)
	const events = await dayEvents(dates)

	// *** VENUES *** 
	// get existing venues
	let existingVenues = readJSON('../site/src/data/venues.json')
	const existingVenueURLs = existingVenues.map(venue => venue.venueURL)
	// get all venues from our events
	const venueURLs = getUniqueVenueURLs(events)
	// work out which venues are new
	const newVenueURLs = compareVenues(existingVenueURLs, venueURLs)
	// look up data for the new venues
	const newVenues = await parseVenues(newVenueURLs)
	// add new venues to the old venues
	const venues = existingVenues.concat(newVenues)

	// *** COMBINE DATA ***
	// add event data to venues, and venue data to events
	const {combinedEvents, combinedVenues} = combineData(events, venues)
	makeJSON(combinedEvents, '../site/src/data/events.json')
	makeJSON(combinedVenues, '../site/src/data/venues.json')
}
