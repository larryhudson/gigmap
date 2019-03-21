const getDaysFromToday = require('./utils/dates')
const {readJSON, makeJSON} = require('./utils/json')
const {dayEvents, parseEventPages, parseEventPage} = require('./utils/events')
const {compareVenues, parseVenues, getUniqueVenueURLs} = require('./utils/venues')
const combineData = require('./utils/combine')

const moment = require('moment-timezone')

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
	const dates = getDaysFromToday(7)
	
	// only keep events that have dates in our range.
	let eventsFromFile = readJSON('../site/src/data/events.json')
	const existingEvents = cullOldEvents(eventsFromFile, dates)
	const cullCount = eventsFromFile.length - existingEvents.length
	console.log( "culled " + cullCount + " old events" )

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

	// get info for first 25
	const unscrapedEvents = events.filter(event => !(event.scraped))
	console.log(unscrapedEvents.length + " events to scrape")
	const eventsToScrape = unscrapedEvents.slice(0,25)
	const scrapedEvents = await parseEventPages(eventsToScrape)

	// overwrite old event in array
	scrapedEvents.forEach(newEvent => {
		var eventIndex = events.findIndex(event => { return event.slug === newEvent.slug })
		events[eventIndex] = newEvent
	})

	// log new filter and write new JSON
	console.log(events.filter(e=>e.scraped).length + " events have been scraped")

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

	// 


}
// Get dates for the next 7 days. Same as before.

// Load in existing events file. Delete events with dates not in our dates range.
// Get new events for next 7 days. If not in existing events file, concatenate.
// Get first 25 events (sorted by date) that have a 'scraped' attribute = False.
// For those 25 events, scrape their event pages and add data to the events file.
// 
// 
// 
// 
// 
// 
// 
// 


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

main2()
