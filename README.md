# Gigmap

Note: Beat Magazine has updated their website layout, which has broken the scraping functionality. I'll try to get back to this project to fix it up soon, but I've got more urgent projects to deal with at the moment.

This is a Gatsby app that shows you what's going on in Melbourne this week - music, comedy, theatre and more. It scrapes [Beat Magazine](https://www.beat.com.au/gig-guide/)'s weekly gig guide.

I've got it hosted at Netlify. [You can see it here](https://gigmap.netlify.com).

## Add your city!

The scraping function reads all the Melbourne-specific info from scrape/config.js, which means you can add your own city by writing a new config file. The goal is to have lots of cities, so that when one developer improves the app, it improves all the different versions of Gigmap. Instructions on how to set up a new config are coming soon.

If this sounds like an interesting project, please send me a message or dig into the code and submit a PR. I'm open to all suggestions.

## To do

This is a work in progress, and it's my first open source project. There's a lot to do:
- Come up with a way to handle multiple city configurations. This might be similar to the way that big Gatsby sites handle internationalisation - same templates, but different data. I don't want to have more than one city's events and venues in a JSON file because each build will take too long.

- Documentation of code. I'll write:
    - a summary of how the scraping functions work, and make a template for new city configurations.
    - instructions on how to clone the repo and get your own local version running, including required environment variables.

- UI - Venue page is very barebones at the moment. Ideally, it should have a map with a marker, and a list of events similar to the main list view of the app (for example colour-coded by genre).

- Overhaul of component styling - I want to use styled-system to ensure consistent spacing, font sizes and colours, but I'm struggling to get my head around it.

- General clean up of code. There's a lot of places where I've cut corners to get something to work. I'll add todo comments in the code over the next few days.

