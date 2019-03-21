# Gigmap
This is a Gatsby app that scrapes [Beat Magazine](https://www.beat.com.au/gig-guide/)'s weekly gig guide.

I've got it hosted at Netlify. [You can see it here](https://gigmap.netlify.com).

It rebuilds every hour.

To do:
- Get more info for each event. At the moment it only scrapes the day pages, but if I scrape each event page, it'll be able to get ticket links, artists and support artists and start times. But I can't ask Beat Mag for 500 events at a time, so it needs to be a bit more clever.
- Make the map easier to use. Instead of just linking to event pages, little info windows should overlay the map. Maybe just venue name and event name
- Should be able to filter what you want to see on the map, and have each category be colour coded. Maybe different shapes for accessibility?
- The home page should have today's events. At the moment it just has a list of days and a map of all the venues that have an event this week.
- I'd also like to make the app more reusable and extendable. Eg: Declaring all the Beat Magazine-specific stuff in a constants file, then trying to replace that data with some aggregator site from Sydney. Should be an interesting experiment.