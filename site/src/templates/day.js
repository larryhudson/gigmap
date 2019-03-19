import React from "react"
import { Link, graphql } from 'gatsby'
import Layout from "../components/layout"
import SEO from "../components/seo"
import GoogleMap from "../components/GoogleMap"
import Marker from "../components/Marker"
import {genreColour} from "../consts/genres"

const DayPage = ({ data, pageContext }) => {
  const events = data.allEventsJson.edges;
  const date = data.allEventsJson.edges[0].node.date;
  const nextDate = pageContext.next;
  const prevDate = pageContext.prev;
  const MELB_CENTER = [-37.8124, 144.9623];
  return (
  <Layout>
    <SEO title={date} keywords={[`music`, `melbourne`]} />
    <h1>Gigs on {date}</h1>
    {prevDate && (
    <p>Previous: <Link to={"/day/" + prevDate.dateStr}>{prevDate.niceDate}</Link></p>
    )}
    {nextDate && (
      <p>Next: <Link to={"/day/" + nextDate.dateStr}>{nextDate.niceDate}</Link></p>
    )}
    <div style={{width: '100%', height: '600px', marginBottom: '2em'}}>
    <GoogleMap
      defaultZoom={12}
      defaultCenter={MELB_CENTER}
      yesIWantToUseGoogleMapApiInternals
    >
    {events.map( ({node: event}) => (
      <Marker
                key={event.slug}
                text={event.venue.name}
                lat={event.venue.coords.lat}
                lng={event.venue.coords.lng}
                eventSlug={event.slug}
                colour={genreColour(event.genre)}
      />  
      ))}
    </GoogleMap>
    </div>
    <h2>{date}</h2>
    <ul>
    {events.map( ({node: event}) => (
      <li key={event.slug}><Link to={event.slug}>{event.title} at {event.venue.name}{event.price && ' '+event.price}</Link></li>
      ))}
    </ul>
  </Layout>
)}

export default DayPage

export const pageQuery = graphql`  
  query($date: String!)  {
  allEventsJson(filter: {date: {eq: $date}}) {
    edges {
      node {
        slug
        title
        genre
        date(formatString: "dddd DD MMMM")
        price
        venue {
          name
          venueURL
          address
          coords {
            lat
            lng
          }
        }
        
      }
    }
  }
}
`
