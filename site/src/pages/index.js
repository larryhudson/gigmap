import React from "react"
import { Link, graphql } from 'gatsby'
import navigate from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import GoogleMap from "../components/GoogleMap"
import Marker from "../components/Marker"

const IndexPage = ({ data }) => {
  const events = data.allEventsJson.edges;
  const venues = data.allVenuesJson.edges;
  const mapVenues = venues.filter(({node: venue}) => venue.coords)
  const MELB_CENTER = [-37.8124, 144.9623];
  return (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{width: '100%', height: '600px'}}>
    <GoogleMap
      defaultZoom={10}
      defaultCenter={MELB_CENTER}
      yesIWantToUseGoogleMapApiInternals
    >
    {mapVenues.map( ({node: venue}) => (
      <Marker
                key={venue.id}
                text={venue.name}
                lat={venue.coords.lat}
                lng={venue.coords.lng}
                venueId={venue.id}
      />  
      ))}
    </GoogleMap>
    </div>
    <h2>Venues</h2>
    <ul>
    {venues.map( ({node: venue}) => (
      <li key={venue.id}><Link to={venue.id}>{venue.name}</Link></li>
      ))}
    </ul>
    <h2>Gigs on today</h2>
    <ul>
    {events.map( ({node: event}) => (
      <li key={event.id}><Link to={event.slug}>{event.title} at {event.venueName} on {event.date}</Link></li>
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
        allEventsJson(sort: {fields: [date], order: ASC}, ) {
          edges {
            node {
              slug
              title
              date(formatString: "DD MMMM")
              venueName
              genre
              region
              price
              infoLink
          }
      }
  }
        allVenuesJson(sort: {fields: [name], order: ASC}, ) {
          edges {
            node {
              id
              name
              coords {
                lat
                lng
              }
            }
          }
        }
}
`
