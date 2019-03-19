import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import genreName from "../consts/genres"
import moment from "moment"

export default ({ data }) => {

  let event;
  let venue;

  if (data.eventsJson) {
    event = data.eventsJson
  } else {
    return (
      <Layout>
        <div>
        <h1>Event not found</h1>
        <p><Link to="/">Go home</Link></p>
        </div>
      </Layout>
      )
  }

  if (data.venuesJson) {
    venue = data.venuesJson
  }
  else {
    return (
      <Layout>
        <div>
        <h1>Venue not found</h1>
        <p>Couldn't find the venue for this gig: {event.slug}</p>
        <p><Link to="/">Go home</Link></p>
        </div>
      </Layout>
      )
  }

  const date = data.eventsJson.date;
  const dateStr = moment(date).format('DD-MM-YYYY')
  const niceDate = moment(date).format('dddd DD MMMM')
  const genreStr = genreName(event.genre)
  
  return (
    <Layout>
      <div>
        <h1>{event.title}</h1>
        <p>Date: <Link to={'/day/' + dateStr}>{niceDate}</Link></p>
        <p>Venue: <Link to={venue.id}>{venue.name}</Link></p>
        {event.price && (
          <p>Price: {event.price}</p>
          )}
        <p>Genre: {genreStr}</p>
        <p>Address: {venue.address}</p>
        <p><a href={event.infoLink}>More info at Beat's website</a></p>
        {venue.website && <p><a href={venue.website}>{venue.name} website</a></p>}
      </div>
    </Layout>
  )
}

export const query = graphql`
query($slug: String!, $venueURL: String!) {
    eventsJson(slug: { eq: $slug } ) {
      title
      price
      date
      venueName
      infoLink
      venueURL
      genre
    }
    venuesJson(venueURL: { eq: $venueURL } ) {
      id
      name
      address
      coords {
        lat
        lng
      }
      website
    }
  }
`