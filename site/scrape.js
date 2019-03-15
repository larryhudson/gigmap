const rp = require('request-promise');
const cheerio = require('cheerio');
const _  = require('lodash');
var fs = require('fs');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBBJCkfY2hvbCJSbjsMEgvo0eKln24LYcA',
  Promise: Promise
});

const url = 'http://www.beat.com.au/gig-guide';
let events = []
let allVenues = []

rp(url)
	.then(function(html){
		//success!
		const $ = cheerio.load(html)
		const events_divs = $('.archive_node-summary-wrapper')
		$(events_divs).each(function(i, event) {
			events[i] = {
				title: $(this).find('h3').text(),
				venueId: 'http://www.beat.com.au' + $(this).find('h5').eq(1).find('a').attr('href'),
				venueName: $(this).find('h5').eq(1).text(),
				genre: $(this).attr('class').split(' ').pop(),
				date: $(this).find('.sidebar_gig-date.day').text() + ' ' + $(this).find('.sidebar_gig-date.month').text(),
				region: $(this).find('h5').eq(2).text(),
				price: $(this).find('h5').eq(3).text(),
				infoLink: ('http://www.beat.com.au' + $(this).find('h3 a').attr('href'))
			}
			console.log('Title: ' + $(this).find('h3').text())
			console.log('Venue: ' + $(this).find('h5').eq(1).text())
			allVenues[i] = {name: $(this).find('h5').eq(1).text(),
	                        link: 'http://www.beat.com.au' + $(this).find('h5').eq(1).find('a').attr('href')}
			console.log('Genre: ' + $(this).attr('class').split(' ').pop())
			console.log('Date: ' + $(this).find('.sidebar_gig-date.day').text() + ' ' + $(this).find('.sidebar_gig-date.month').text())
			console.log('Region: ' + $(this).find('h5').eq(2).text())
			console.log('Price: ' + $(this).find('h5').eq(3).text())
			console.log('More info: http://www.beat.com.au' + $(this).find('h3 a').attr('href'))
			console.log('------------------')
		})
		console.log('------------------')
		console.log('------------------')
		console.log('------------------')
		console.log("JSON OUTPUT - EVENTS")
		const eventsJSON = JSON.stringify(events)
		console.log(eventsJSON)
		fs.writeFile("src/data/events.json", eventsJSON, function(err) {
		    if (err) {
		        console.log(err);
		    }
		});
		console.log('------------------')
		console.log('------------------')
		console.log('------------------')
		let venues = _.uniqBy(allVenues, 'name');
		venues = venues.filter(function( element ) {
		   return element !== undefined;
		});
		return Promise.all(
			venues.map(function(venue) {
				return addVenueInfo(venue)
			})
			)
		.then(function(updatedVenues) {
			let newVenues = updatedVenues.filter(function( element ) {
			   return element !== undefined;
			});
			console.log('Number of venues: ' + newVenues.length)
			console.log('------------------')
			console.log('------------------')
			console.log('------------------')
			console.log('JSON OUTPUT - VENUES')
			console.log(JSON.stringify(newVenues))
			const venuesJSON = JSON.stringify(newVenues)
			console.log(venuesJSON)
			fs.writeFile("src/data/venues.json", venuesJSON, function(err) {
			    if (err) {
			        console.log(err);
			    }
			});
			console.log('------------------')
			console.log('------------------')
			console.log('------------------')

			// updatedVenues.forEach(function(venue, index) {
			// 	console.log('Venue number ' + (index + 1))
			// 	console.log('Venue name: ' + venue.name)
			// 	console.log('Address: ' + venue.address)
			// 	console.log('More info link: ' + venue.website)
			// 	console.log('------------------')
			// })
		});
	})
	.catch(function(err){
		console.log(err)
	//handle error
	});

function addVenueInfo(venue) {
	const {name, link} = venue
	let address = ''
	let website = ''
	if (link) {
		return rp(link)
			.then(function(html){
				//success!
				const $ = cheerio.load(html)
				address = $('.gigguide_node-summary-detail').eq(0).text()
				website = $('.gigguide_gigdetail-details a').eq(0).attr('href')
				const coords = googleMapsClient.geocode({address: address})
				  .asPromise()
				  .then((response) => {
				    return response.json.results[0].geometry.location
				  })
				  .catch((err) => {
				    console.log(err);
				  });
				console.log(coords);
				return {name: name, link: link, address: address, website: website, coords: coords}
			})
			.catch(function(err){
			//handle error
			});
	} else {
		return {name: name,
		        link: link,
		        address: address,
		        website: website}
	}
	
}