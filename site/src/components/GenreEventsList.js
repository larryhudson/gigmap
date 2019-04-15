import PropTypes from "prop-types";
import React from "react";
import { getGenreName, genreColour } from "../consts/genres";
import styled from "styled-components";
import { space } from "styled-system";
import { Link } from "gatsby";
import AnchorLink from "react-anchor-link-smooth-scroll";

const EventCard = styled(Link)`
  background: ${props => (props.bg ? props.bg : "lightgray")};
  list-style-type: none;
  flex-basis: calc(50% - 5px);
  font-size: 90%;
  padding: 5px;
  color: black;
  margin-bottom: 10px;
  text-decoration: none;
  border: 1px solid lightgray;

  @media (min-width: 480px) {
    flex-basis: calc(33.33% - 5px);
    padding: 10px;
    font-size: 100%;
  }

  @media (min-width: 768px) {
    flex-basis: calc(25% - 5px);
  }
`;

const JumpCard = styled(AnchorLink)`
  background: ${props => (props.bg ? props.bg : "lightgray")};
  list-style-type: none;
  flex-basis: calc(50% - 5px);
  font-size: 90%;
  padding: 5px;
  color: black;
  margin-bottom: 10px;
  text-decoration: none;
  border: 1px solid lightgray;

  @media (min-width: 480px) {
    flex-basis: calc(33.33% - 5px);
    padding: 10px;
    font-size: 100%;
  }

  @media (min-width: 768px) {
    flex-basis: calc(25% - 5px);
  }
`;

export const UnstyledAnchor = styled(AnchorLink)`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  cursor: pointer;
  color: inherit;
  font: inherit;
  line-height: normal;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  outline: 1px solid black;
  padding: 15px 15px;
  margin-right: 5px;
  &:active {
    background: lightgray;
  }
  text-decoration: none;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const EventTitle = styled.h4`
  margin-bottom: 0.5em;
  line-height: 1.5;
  font-size: 90%;

  @media (min-width: 480px) {
    font-size: 100%;
  }
`;

const EventVenue = styled.span``;

const GenreHeading = styled.h3`
  background: ${props => (props.bg ? props.bg : "transparent")};
  display: block;
  font-size: 1.25rem;
  margin-bottom: 0;
  ${space}
`;

function getDistance(venueCoords, location) {
  if (location && venueCoords) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(venueCoords.lat - location.lat); // deg2rad below
    var dLng = deg2rad(venueCoords.lng - location.lng);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(venueCoords.lat)) *
        Math.cos(deg2rad(location.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;

    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
  } else {
    return null;
  }
}

class GenreEventsList extends React.Component {
  render() {
    const { genres, date, eventsAtFavouriteVenues, location } = this.props;
    return (
      <div style={{ marginTop: "10px", marginBottom: "40px" }}>
        {genres.length > 1 && (
          <div>
            <GenreHeading p={["2", "3"]} id={"jump-to-genre" + date}>
              Jump to category
            </GenreHeading>
            <CardList>
              {eventsAtFavouriteVenues.length > 0 && (
                <JumpCard
                  bg="lightyellow"
                  color="black"
                  href={"#" + date + "-favourite-venues"}
                >
                  Events at your favourite venues (
                  {eventsAtFavouriteVenues.length})
                </JumpCard>
              )}

              {genres.map(genre => (
                <JumpCard
                  key={"jump-to" + genre.fieldValue}
                  bg={genreColour(genre.fieldValue, 0.25)}
                  color="black"
                  href={"#" + genre.fieldValue}
                >
                  {getGenreName(genre.fieldValue)} ({genre.totalCount})
                </JumpCard>
              ))}
            </CardList>
          </div>
        )}
        {eventsAtFavouriteVenues.length > 0 && (
          <div>
            <GenreHeading
              id={date + "-favourite-venues"}
              p={["2", "3"]}
              style={{ background: "lightyellow", marginBottom: "10px" }}
            >
              Events at your favourite venues ({eventsAtFavouriteVenues.length})
            </GenreHeading>
            <CardList>
              {eventsAtFavouriteVenues.map(({ node: event }) => {
                return (
                  <EventCard
                    key={event.slug}
                    to={event.slug}
                    color="black"
                    bg={genreColour(event.genre, 0.25)}
                  >
                    <EventTitle>{event.title}</EventTitle>
                    <EventVenue>{event.venue.name}</EventVenue>
                    <br />
                    {event.startTime && event.startTime}
                    <br />
                    {event.price &&
                      (event.price === "$0.00" ? "Free" : event.price)}
                  </EventCard>
                );
              })}
            </CardList>
          </div>
        )}
        {genres.map(genre => {
					const sortedGenreEdges = genre.edges.map(({ node: event }) => {
						return {...event,
										distance: getDistance(event.venue.coords, location)}
					}).sort((a, b) => {
						if (a.venue.coords === null) {
							return 1
						} else if (b.venue.coords === null) {
							return -1
						} else {
							return (a.distance > b.distance) ? 1 : -1
						}
					})
          return (
            <div key={"genre-events-" + date + genre.fieldValue}>
              <div
                style={{
                  display: "flex",
                  background: genreColour(genre.fieldValue, 0.25),
                  justifyContent: "space-between",
                  marginBottom: "10px"
                }}
              >
                <GenreHeading p={["2", "3"]} id={genre.fieldValue}>
                  {getGenreName(genre.fieldValue)} ({genre.totalCount})
                </GenreHeading>
                <UnstyledAnchor
                  bg={genreColour(genre.fieldValue, 0.25)}
                  href={"#jump-to-genre" + date}
                >
                  Top
                </UnstyledAnchor>
              </div>
              <CardList>
                {sortedGenreEdges.map((event) => {
                  return (
                    <EventCard
                      key={event.slug}
                      to={event.slug}
                      color="black"
                      bg={genreColour(event.genre, 0.25)}
                    >
                      <EventTitle>{event.title}</EventTitle>
                      <EventVenue>{event.venue.name}</EventVenue>
                      <br />
                      {event.startTime && event.startTime}
                      <br />
                      {event.price &&
												(event.price === "$0.00" ? "Free" : event.price)}
											{event.distance && <span><br />
												{event.distance.toFixed(2) + "km"}</span>
											}
                    </EventCard>
                  );
                })}
              </CardList>
            </div>
          );
        })}
      </div>
    );
  }
}

GenreEventsList.propTypes = {
  genres: PropTypes.array,
  date: PropTypes.string
};

GenreEventsList.defaultProps = {
  genres: [],
  date: ""
};

export default GenreEventsList;
