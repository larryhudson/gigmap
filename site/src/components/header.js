import PropTypes from "prop-types";
import React from "react";
import {UnstyledLink} from "./bottomButtons"

const Header = ({ siteTitle, title, hideAboutLink }) => (
  <header
    style={{
      background: `white`,
      marginBottom: `0.25rem`
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `0.5rem 0.25rem`,
        display: `flex`,
        justifyContent: `space-between`,
        alignItems: `center`
      }}
    >
      <h1 style={{ margin: 0, fontSize: "20px", color: "black" }}>
        Gigmap: {title}
      </h1>
      {hideAboutLink && <UnstyledLink to="/">Back</UnstyledLink>}
      {!hideAboutLink && <UnstyledLink to="/about">About</UnstyledLink>}
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
  title: PropTypes.string
};

Header.defaultProps = {
  siteTitle: ``,
  title: ``
};

export default Header;
