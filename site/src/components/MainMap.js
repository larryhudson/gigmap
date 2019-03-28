import React, { Component } from 'react';

// components:
import Marker from '../components/Marker';
import Balloon, {CloseBalloon} from '../components/Balloon';
import {genreColour} from '../consts/genres';

// examples:
import GoogleMapReact from 'google-map-react';
import styled from 'styled-components';

const Wrapper = styled.main`
  display: ${props => props.showing ? 'block' : 'none'};
  width: 100%;
  height: 90vh;
  margin-bottom: 0;
  position: relative;
  overflow-y: hidden;
`;

const InfoWindowDiv = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 20px 10px 30px;
  height: auto;
  background: lightgray;
  z-index: 2;
`

const InfoWindow = (props) => {
  return (
    <InfoWindowDiv>
      {props.children}
      <h3>{props.eventTitle}</h3>
      {props.venue}
    </InfoWindowDiv>
  )
}

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

// // Fit map to its bounds after the api on change
// const setBounds = (map, maps, events) => {
//   // Get bounds by our places
//   const bounds = getMapBounds(map, maps, events);
//   // Fit map to bounds
//   map.fitBounds(bounds);
// };

class MainMap extends Component {
  constructor(props) {
    super(props)
    this.map = React.createRef()
    this.state = {openMarker: null}
    this._onChildClick=this._onChildClick.bind(this);
    this.closeBalloon =this.closeBalloon.bind(this);
  }

  componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
  if (this.props.genres !== prevProps.genres) {
    if ((this.props.genres.length > prevProps.genres.length) && this.props.genres.length > 1) {
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
}
  _onChildClick(key, childProps) {
    const {openMarker} = this.state
    if ((openMarker === null) || (openMarker.key !== key)) {
      let openMarker = {key, eventTitle: childProps.eventTitle, venue: childProps.venue}
      this.setState({openMarker})
    }
  }

  closeBalloon() {
    this.setState({openMarker: null})
  }

  render() {
    const { openMarker } = this.state;
    const { genres } = this.props;
    let showingEvents = []
    genres.forEach(genre => {
      genre.edges.forEach(event => {
        showingEvents.push(event)
      })
    })

    return (
      <Wrapper showing={this.props.showing}>
          <GoogleMapReact
            defaultZoom={10}
            defaultCenter={MELB_CENTER}
            bootstrapURLKeys={{
            key: process.env.REACT_APP_MAP_KEY,
            }}
            onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, showingEvents)}
            yesIWantToUseGoogleMapApiInternals
            ref={this.map}
            onChildClick={this._onChildClick}
          >
            {showingEvents.map( ({node: event}) => {
              const isOpen = (openMarker && (openMarker.key === event.slug))
              if (isOpen) {
                return (
                  <Balloon
              isOpen={isOpen}
              key={event.slug}
              venue={event.venue.name}
              eventTitle={event.title}
              lat={event.venue.coords.lat}
              lng={event.venue.coords.lng}
              eventSlug={event.slug}
              bg={genreColour(event.genre)}
              genre={event.genre}>
              <CloseBalloon onClick={this.closeBalloon}>
                X
              </CloseBalloon>
              </Balloon>
                  )
              }
              return <Marker
              isOpen={isOpen}
              key={event.slug}
              venue={event.venue.name}
              eventTitle={event.title}
              lat={event.venue.coords.lat}
              lng={event.venue.coords.lng}
              eventSlug={event.slug}
              bg={genreColour(event.genre)}
          />
          })}
          </GoogleMapReact>
          {openMarker && (
          <InfoWindow eventTitle={openMarker.eventTitle} venue={openMarker.venue}>
            <CloseBalloon onClick={this.closeBalloon}>
              X
            </CloseBalloon>
          </InfoWindow>
          )}
      </Wrapper>
    );
  }
}

export default MainMap;