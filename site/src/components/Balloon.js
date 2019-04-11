import React from 'react';
import {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Link} from "gatsby";

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150px;
  font-size: 14px;
  height: auto;
  border: 2px solid #000;
  padding: 10px;
  background-color: ${props => props.isFavourite ? "gold" : props.bg};
  color: ${props => (props.genre === 'arts-theatre-burlesque-markets') ? 'white' : 'black'};
  border-radius: 5px;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${props => (props.onClick ? 'pointer' : 'default')};
  z-index: 10;

  a {
    color: ${props => (props.genre === 'arts-theatre-burlesque-markets') ? 'white' : 'black'};
    text-decoration: none;
  }
`;

export const CloseBalloon = styled.div`
float: right;
padding: 1px 1px 3px 3px;
z-index: 11;
cursor: pointer;
`

class MarkerBalloon extends Component {
  
  render() {
    return <Wrapper
    alt={this.props.venue}
    bg={this.props.bg}
    genre={this.props.genre}
    isFavourite={this.props.isFavourite}>
    {this.props.children}
    <Link to={this.props.eventSlug}><strong>{this.props.eventTitle}</strong> at {this.props.venue}</Link>
    </Wrapper>
  }
}

MarkerBalloon.defaultProps = {
  onClick: null,
  bg: 'black'
};

MarkerBalloon.propTypes = {
  onClick: PropTypes.func,
  venue: PropTypes.string,
};

export default MarkerBalloon;