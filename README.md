# GETTING DATA
- First scrape
	- get all events
		- event id - based on more info link (unique)
		- title
		- date
		- genre
		- venue id
		- ticket price
		- region
		- more info link
	- get all venues.
		- name
		- address
		- map coords - use google maps
		- more info link
		- venue id - based on info link (unique)
		- save in a json file.
- Second scrape
	- get new events
		- check against old events, try to update data? or replace data?
	- get new venues
		- check against old venues, only add new ones.
- Each scrape
	- Keep a log with diffed data. Want to find out when Beat Mag updates their info.


# GATSBY APP - RENDERING DATA
- Pages for:
	- Index - today's gigs
	- List of days - calendar
	- Each date - each day's gigs
	- List of venues - map?
	- Each venue - each venue's gigs
	- List of genres
	- Each genre
	- Each gig
	- Filter by price - free gigs.
- Sign up so you can:
	- Have favourite venues
	- Have favourite genres
	- Hide stuff you don't care about
	- Save individual events?
	