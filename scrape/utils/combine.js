const fs = require("fs")
const {clone} = require("./json")

// TODO: Make this reusable for different arrays? I tried to this but it got too unreadable.
function combineData(events, venues) {
	const combinedEvents = events.map(event => {
		let combinedEvent = clone(event)
		if (combinedEvent.venue === undefined) {
			combinedEvent.venue = venues.find(venue => venue.venueURL === event.venueURL)
		}
		if (combinedEvent.venue.events) {
			delete combinedEvent.venue.events
		}
		return combinedEvent
	})

	const combinedVenues = venues.map(venue => {
		let combinedVenue = clone(venue)
		if (combinedVenue.events === undefined) {
			combinedVenue.events = events.filter(event => event.venueURL === venue.venueURL)
		}
		combinedVenue.events.forEach(event => {
			if (event.venue) {
				delete event.venue
			}})
		return combinedVenue
	})

	return {combinedEvents, combinedVenues}
}

module.exports = combineData




