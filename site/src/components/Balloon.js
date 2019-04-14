import React from "react";
import { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "gatsby";
import {UnstyledButton, UnstyledLink} from "./bottomButtons"

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150px;
  font-size: 14px;
  height: auto;
  border: 2px solid #000;
  padding: 10px;
  background-color: ${props => (props.isFavourite ? "gold" : props.bg)};
  color: ${props =>
    props.genre === "arts-theatre-burlesque-markets" ? "white" : "black"};
  border-radius: 5px;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${props => (props.onClick ? "pointer" : "default")};
  z-index: 10;

  a {
    color: ${props =>
      props.genre === "arts-theatre-burlesque-markets" ? "white" : "black"};
    text-decoration: none;
  }
`;

const InfoWindowDiv = styled.div`
  position: fixed;
  bottom: 55px;
  background: ${props => props.bg};
  color: ${props =>
    props.genre === "arts-theatre-burlesque-markets" ? "white" : "black"};
  width: 100%;
  padding: 10px 5px;
  max-width: 960px;
  margin: 0 auto;
  left: 0;
  right: 0;

  a {
    color: ${props =>
      props.genre === "arts-theatre-burlesque-markets" ? "white" : "black"};
    text-decoration: none;
  }
`;

export const CloseBalloon = styled.div`
  padding: 5px 5px 20px 20px;
  height: 40px;
  text-align: center;
  z-index: 11;
  font-size: 18px;
  cursor: pointer;
`;

export const InfoWindow = props => {
  console.log(props)
  function closeInfoWindow() {
    props.onCloseInfoWindow();
  }
  const { event, onToggleFavourite, isFavourite } = props;
  const favouriteButtonText = isFavourite
    ? "Unfavourite venue"
    : "Favourite venue";
  return (
    <InfoWindowDiv bg={event.bg} genre={event.genre}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <div>
              <p>
                <strong>{event.eventTitle}</strong><br />
                {event.supports &&
                  <span>{`Supports: ${event.supports
                    .map(({ name }) => name)
                    .join(", ")}`}<br /></span>}
                Venue: {event.venue}
              </p>
            </div>
            <div>
              <p>
                {event.price && event.price === "$0.00"
                  ? "Free"
                  : `${event.price}`}
                <br />
                {event.startTime && `${event.startTime}`}
              </p>
            </div>
          </div>
          <CloseBalloon onClick={closeInfoWindow}>X</CloseBalloon>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <UnstyledLink to={event.eventSlug}>More info</UnstyledLink>
          <UnstyledButton onClick={() => onToggleFavourite(event.venueURL)}>
            {favouriteButtonText}
          </UnstyledButton>
        </div>
      </div>
    </InfoWindowDiv>
  );
};

class MarkerBalloon extends Component {
  render() {
    return (
      <Wrapper
        alt={this.props.venue}
        bg={this.props.bg}
        genre={this.props.genre}
        isFavourite={this.props.isFavourite}
      >
        {this.props.children}
        <Link to={this.props.eventSlug}>
          <strong>{this.props.eventTitle}</strong> at {this.props.venue}
        </Link>
      </Wrapper>
    );
  }
}

MarkerBalloon.defaultProps = {
  onClick: null,
  bg: "black"
};

MarkerBalloon.propTypes = {
  onClick: PropTypes.func,
  venue: PropTypes.string
};

export default MarkerBalloon;
