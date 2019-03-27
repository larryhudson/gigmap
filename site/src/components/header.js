import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle, title }) => (
  <header
    style={{
      background: `white`,
      marginBottom: `0.25rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `0.5rem 0.25rem`,
      }}
    >
      <h1 style={{ margin: 0, fontSize: '16px', color: 'black' }}>
          Gigmap: {title}
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
  title: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
  title: ``,
}

export default Header
