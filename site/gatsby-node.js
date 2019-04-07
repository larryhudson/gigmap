/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const path = require(`path`)
const uniqBy = require('lodash.uniqby');
const moment = require('moment');


exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return graphql(`
    {
      allEvents: allEventsJson
      (sort: {fields: [date], order: ASC} ) {
	    edges {
	      node {
	        slug
          venueURL
          date
	      }
	    }
	  }
    allVenues: allVenuesJson {
      edges {
        node {
          id
          venueURL
        }
      }
    }
    dates: allEventsJson {
    group(field: date) {
      fieldValue
    }
  }
}
  `).then(result => {
    result.data.allEvents.edges.forEach(({ node }) => {
      createPage({
        path: node.slug,
        component: path.resolve(`./src/templates/event.js`),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          slug: node.slug,
          venueURL: node.venueURL
        },
      })
    })
    result.data.allVenues.edges.forEach(({ node }) => {
      createPage({
        path: node.id,
        component: path.resolve(`./src/templates/venue.js`),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          id: node.id,
          venueURL: node.venueURL
        },
      })
    })
    const dates = result.data.dates.group.map(({fieldValue}) => {
        return fieldValue
      })
    dates.forEach((date, index) => {
      let dateStr = moment(date).format('DD-MM-YYYY')
      createPage({
      path: (index === 0 ? '/' : path.join('/day', dateStr)),
      component: path.resolve('./src/templates/day-hooks.js'),
      context: {
        date: date,
        prevDate: index === 0 ? null : dates[index - 1],
        nextDate: index === (dates.length - 1) ? null : dates[index + 1]
      }
      })
    })
  })
}
