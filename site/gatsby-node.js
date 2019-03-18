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
      allEventsJson
      (sort: {fields: [date], order: ASC} ) {
	    edges {
	      node {
	        slug
          venueURL
          date
	      }
	    }
	  }
    allVenuesJson {
      edges {
        node {
          id
          venueURL
        }
      }
    }
    }
  `).then(result => {
    result.data.allEventsJson.edges.forEach(({ node }) => {
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
    result.data.allVenuesJson.edges.forEach(({ node }) => {
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
    const dates = uniqBy(result.data.allEventsJson.edges.map(({node}) => {
        const dateVal = node.date
        const dateStr = moment(node.date).format('DD-MM-YYYY')
        const niceDate = moment(node.date).format('dddd D MMMM')
        return { dateVal, dateStr, niceDate }
      }), 'dateVal')
    dates.forEach((date, index) => {
      console.log(date)
      createPage({
      path: path.join('/day', date.dateStr),
      component: path.resolve('./src/templates/day.js'),
      context: {
        date: date.dateVal,
        prev: index === 0 ? null : dates[index - 1],
        next: index === (dates.length - 1) ? null : dates[index + 1]
      }
      })
    })
  })
}