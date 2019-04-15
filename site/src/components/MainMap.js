import React, { Component } from "react";

// components:
import Marker from "../components/Marker";
import Balloon, { CloseBalloon, InfoWindow } from "../components/Balloon";
import { genreColour } from "../consts/genres";
import mapStyles from "./mapStyles.json";

// examples:
import GoogleMapReact from "google-map-react";
import styled from "styled-components";

const Wrapper = styled.main`
  width: 100%;
  height: 90vh;
  margin-bottom: 0;
  position: relative;
  overflow-y: hidden;
`;

const MELB_CENTER = [-37.8124, 144.9623];

const defaultMapOptions = {
  styles: mapStyles
};

function getDistance(venueCoords, location) {
  if (location) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(venueCoords.lat-location.lat);  // deg2rad below
    var dLng = deg2rad(venueCoords.lng-location.lng); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(venueCoords.lat)) * Math.cos(deg2rad(location.lat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d.toFixed(2) + "km";

    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }
  } else {
    return null
  }
}

// Return map bounds based on list of places
const getMapBounds = (map, maps, events) => {
  const bounds = new maps.LatLngBounds();

  events.forEach(event => {
    bounds.extend(
      new maps.LatLng(event.node.venue.coords.lat, event.node.venue.coords.lng)
    );
  });
  return bounds;
};

// Re-center map when resizing the window
const bindResizeListener = (map, maps, bounds) => {
  maps.event.addDomListenerOnce(map, "idle", () => {
    maps.event.addDomListener(window, "resize", () => {
      map.fitBounds(bounds);
    });
  });
};

// Fit map to its bounds after the api is loaded
const apiIsLoaded = (map, maps, events) => {
  // Get bounds by our places
  const bounds = getMapBounds(map, maps, events);
  // Fit map to bounds
  map.fitBounds(bounds);
  // Bind the resize listener
  bindResizeListener(map, maps, bounds);
};

// // Fit map to its bounds after the api on change
// const setBounds = (map, maps, events) => {
//   // Get bounds by our places
//   const bounds = getMapBounds(map, maps, events);
//   // Fit map to bounds
//   map.fitBounds(bounds);
// };

class MainMap extends Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();
    this.state = { openMarker: null };
    this._onChildClick = this._onChildClick.bind(this);
    this.closeBalloon = this.closeBalloon.bind(this);
    this.toggleFavourite = this.toggleFavourite.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.genres !== prevProps.genres) {
      if (
        this.props.genres.length > prevProps.genres.length &&
        this.props.genres.length > 1
      ) {
        const bounds = new window.google.maps.LatLngBounds();
        this.props.genres.forEach(genre => {
          genre.edges.forEach(event => {
            bounds.extend(
              new window.google.maps.LatLng(
                event.node.venue.coords.lat,
                event.node.venue.coords.lng
              )
            );
          });
        });
        if (this.map.current && this.map.current.map_) {
          this.map.current.map_.fitBounds(bounds);
        }
      }
    }
  }
  _onChildClick(key, childProps) {
    const { openMarker } = this.state;
    if (openMarker === null || openMarker.key !== key) {
      let openMarker = {
        key,
        ...childProps
      };
      this.setState({ openMarker });
    }
  }

  closeBalloon() {
    this.setState({ openMarker: null });
  }

  toggleFavourite(venueURL) {
    this.props.onAddToFavourites(venueURL);
  }

  render() {
    const { openMarker, showingLocation } = this.state;
    const { genres, favouriteVenues } = this.props;
    console.log(this.props.location);
    let showingEvents = [];
    genres.forEach(genre => {
      genre.edges.forEach(event => {
        if (event.node.venue.coords !== null) {
          showingEvents.push(event);
        }
      });
    });
    

    return (
      <Wrapper>
        <GoogleMapReact
          defaultZoom={10}
          defaultCenter={MELB_CENTER}
          bootstrapURLKeys={{
            key: process.env.REACT_APP_MAP_KEY
          }}
          onGoogleApiLoaded={({ map, maps }) =>
            apiIsLoaded(map, maps, showingEvents)
          }
          yesIWantToUseGoogleMapApiInternals
          ref={this.map}
          onChildClick={this._onChildClick}
          defaultOptions={defaultMapOptions}
        >
          {showingEvents.map(({ node: event }) => {
            const isOpen = openMarker && openMarker.key === event.slug;
            return (
              <Marker
                isOpen={isOpen}
                key={event.slug}
                venue={event.venue.name}
                eventTitle={event.title}
                lat={event.venue.coords.lat}
                lng={event.venue.coords.lng}
                distance={getDistance(event.venue.coords, this.props.location)}
                eventSlug={event.slug}
                bg={genreColour(event.genre)}
                isFavourite={favouriteVenues.includes(event.venue.venueURL)}
                price={event.price}
                genre={event.genre}
                supports={event.supports}
                startTime={event.startTime}
                venueURL={event.venue.venueURL}
              />
            );
          })}
          {this.props.location && (
            <Marker
              lat={this.props.location.lat}
              lng={this.props.location.lng}
              bg="purple"
            />
          )}
        </GoogleMapReact>
        {openMarker && (
          <InfoWindow
            event={openMarker}
            isFavourite={favouriteVenues.includes(openMarker.venueURL)}
            onCloseInfoWindow={this.closeBalloon}
            onToggleFavourite={venueURL =>
              this.props.onToggleFavourite(venueURL)
            }
          />
        )}
      </Wrapper>
    );
  }
}

export default MainMap;
