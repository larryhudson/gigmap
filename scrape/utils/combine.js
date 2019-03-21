const fs = require("fs")
const {clone} = require("./json")

// TODO: Make this reusable for different arrays? I tried to this but it got too unreadable.
function combineData(events, venues) {
	const combinedEvents = events.map(event => {
		let combinedEvent = clone(event)
		combinedEvent.venue = venues.find(venue => venue.venueURL === event.venueURL)
		return combinedEvent
	})

	const combinedVenues = venues.map(venue => {
		let combinedVenue = clone(venue)
		combinedVenue.events = events.filter(event => event.venueURL === venue.venueURL)
		return combinedVenue
	})

	return {combinedEvents, combinedVenues}
}

module.exports = combineData




