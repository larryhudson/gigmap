const getDaysFromToday = require('./utils/dates')
const {readJSON, makeJSON} = require('./utils/json')
const dayEvents = require('./utils/events')
const {compareVenues, parseVenues, getUniqueVenueURLs} = require('./utils/venues')
const combineData = require('./utils/combine')

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

main()
