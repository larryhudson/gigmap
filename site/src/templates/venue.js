import React, {useState, useEffect} from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Link } from "gatsby"
import SEO from "../components/seo"
import {UnstyledButton} from "../components/bottomButtons"

export default ({ data }) => {
  let initialFavouriteVenues;

  if (
    typeof localStorage !== "undefined" &&
    localStorage.getItem("favouriteVenues")
  ) {
    initialFavouriteVenues = JSON.parse(localStorage.getItem("favouriteVenues"));
  } else {
    initialFavouriteVenues = [];
  }

  const [favouriteVenues, setFavouriteVenues] = useState(initialFavouriteVenues)

  useEffect(() => {
    localStorage.setItem("favouriteVenues", JSON.stringify(favouriteVenues));
  }, [favouriteVenues]);

  let venue;
  let events;
  if (data.venuesJson) {
    venue = data.venuesJson
  } else {
    return (
      <Layout>
        <div>
        <h1>Venue not found</h1>
        <p><Link to="/">Go home</Link></p>
        </div>
      </Layout>
      )
  }
  if (data.allEventsJson) {
    events = data.allEventsJson.edges
  } else {
    return (
      <Layout>
        <div>
        <h1>Gigs at {venue.name}</h1>
        <p>No events found.</p>
        </div>
      </Layout>
    )
  }

  const isFavouriteVenue = favouriteVenues.includes(venue.venueURL)

  const favouriteButtonText = isFavouriteVenue ? "Remove from favourites" : "Add to favourites"

  function toggleFavouriteVenue() {
    if (!isFavouriteVenue) {
      setFavouriteVenues(previousFavouriteVenues =>
        [...previousFavouriteVenues, venue.venueURL]
      );
    } else {
      setFavouriteVenues(previousFavouriteVenues =>
        previousFavouriteVenues.filter(venueURL => !(venueURL === venue.venueURL))
      );
    }
  }

  return (
    <Layout>
    <SEO title={venue.name} keywords={[`music`, `melbourne`]} />
      <div>
        <h1>{venue.name}</h1>
        <UnstyledButton onClick={toggleFavouriteVenue}>{favouriteButtonText}</UnstyledButton>
        <ul>
        {events.map( ({node: event}) => (
        <li key={venue.venueURL + event.slug}><Link to={event.slug}>{event.title} on {event.date}</Link></li>
        ))}
        </ul>
        <p>Address: {venue.address}</p>
        {venue.website && <p><a href={venue.website}>{venue.name} website</a></p>}
      </div>
    </Layout>
  )
}

export const query = graphql`
query($venueURL: String!) {
    allEventsJson(filter: { venueURL: { eq: $venueURL } } ) {
      edges {
        node {
          title
          date(formatString: "DD MMMM")
          slug
        }
      }
    }
    venuesJson(venueURL: { eq: $venueURL } ) {
      id
      name
      address
      venueURL
      coords {
        lat
        lng
      }
      website
    }
  }
`