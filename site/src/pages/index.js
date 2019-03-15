import React from "react"
import { Link } from "gatsby"
import { graphql } from 'gatsby'

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = ({ data }) => {
  const events = data.allEventsJson.edges;
  return (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <h2>Gigs on today</h2>
    <ul>
    {events.map( ({node: event}) => (
      <li key={event.id}>{event.title} at {event.venueName}</li>
      ))}
    </ul>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)}

export default IndexPage

export const pageQuery = graphql`  
    query IndexQuery {
        allEventsJson(sort: {fields: [title], order: DESC}, ) {
          edges {
            node {
              id
              title
              venueName
              genre
              region
              price
              infoLink
          }
      }
  }
}
`
