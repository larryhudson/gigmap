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
const uniq = require('lodash.uniq');
const moment = require('moment');


exports.onCreateNode = ({ node, actions }) => {
  const { createNode, createNodeField } = actions
  if (node.venueURL) {
    console.log(node.venueURL)
  }
  // Transform the new node here and create a new node or
  // create a new node field.
}


exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return graphql(`
    {
      allEventsJson {
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
    const dates = uniq(result.data.allEventsJson.edges.map(({node}) => {
      return node.date;
    }))
    dates.forEach(date => {
      const dateStr = moment(date).format('DD-MM-YYYY')
      createPage({
      path: path.join('/day', dateStr),
      component: path.resolve('./src/templates/day.js'),
      context: {
        date
      }
      })
    })
  })
}