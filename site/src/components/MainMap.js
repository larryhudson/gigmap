import React, { Component, Fragment } from 'react';
import isEmpty from 'lodash.isempty';

// components:
import Marker from '../components/Marker';
import {genreColour, getGenreName} from '../consts/genres';

// examples:
import GoogleMapReact from 'google-map-react';
import styled from 'styled-components';

const Wrapper = styled.main`
  width: 100%;
  height: 500px;
  margin-bottom: 10px;
`;


const MELB_CENTER = [-37.8124, 144.9623];

// Return map bounds based on list of places
const getMapBounds = (map, maps, events) => {
  const bounds = new maps.LatLngBounds();

  events.forEach((event) => {
    bounds.extend(new maps.LatLng(
      event.node.venue.coords.lat,
      event.node.venue.coords.lng,
    ));
  });
  return bounds;
};

// Re-center map when resizing the window
const bindResizeListener = (map, maps, bounds) => {
  maps.event.addDomListenerOnce(map, 'idle', () => {
    maps.event.addDomListener(window, 'resize', () => {
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

// Fit map to its bounds after the api on change
const setBounds = (map, maps, events) => {
  // Get bounds by our places
  const bounds = getMapBounds(map, maps, events);
  // Fit map to bounds
  map.fitBounds(bounds);
};

class MainMap extends Component {
  constructor(props) {
    super(props)
    this.map = React.createRef()
  }

  componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
  if (this.props.genres !== prevProps.genres) {
    const bounds = new window.google.maps.LatLngBounds()
    this.props.genres.forEach(genre => {
      genre.edges.forEach(event => {
        bounds.extend(new window.google.maps.LatLng(
          event.node.venue.coords.lat,
          event.node.venue.coords.lng
      ));
      })
    })
    if (this.map.current && this.map.current.map_) {
      this.map.current.map_.fitBounds(bounds)
    }
  }
}

  render() {
    console.log(this.map)
    const { genres } = this.props;
    let showingEvents = []
    genres.forEach(genre => {
      genre.edges.forEach(event => {
        showingEvents.push(event)
      })
    })

    return (
      <Wrapper>
        {!isEmpty(genres) && (
          <GoogleMapReact
            defaultZoom={10}
            defaultCenter={MELB_CENTER}
            bootstrapURLKeys={{
            key: process.env.REACT_APP_MAP_KEY,
            }}
            onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, showingEvents)}
            yesIWantToUseGoogleMapApiInternals
            ref={this.map}
          >
            {showingEvents.map( ({node: event}) => {
              return <Marker
              key={event.slug}
              text={event.venue.name}
              lat={event.venue.coords.lat}
              lng={event.venue.coords.lng}
              eventSlug={event.slug}
              bg={genreColour(event.genre)}
          />
          })}
          </GoogleMapReact>
        )}
      </Wrapper>
    );
  }
}

export default MainMap;