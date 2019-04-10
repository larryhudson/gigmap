import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import Header from "../components/header";
import SEO from "../components/seo";

const SecondPage = () => (
  <Layout>
    <Header title="About" hideAboutLink />
    <SEO title="About" />
    <div style={{ padding: "10px" }}>
      <p>Hi! My name's Larry.</p>
      <p>
        Gigmap is a little app that shows you what's going on around Melbourne.
      </p>
      <p>
        Information comes from{" "}
        <a href="http://www.beat.com.au/gig-guide">Beat Magazine's gig guide</a>
        .
      </p>
      <p>
        I made this app using <a href="http://gatsbyjs.org">Gatsby</a>,{" "}
        <a href="https://reactjs.org">React</a>,{" "}
        <a href="https://aws.amazon.com/s3/">Amazon S3</a> and{" "}
        <a href="https://netlify.com">Netlify</a>.
      </p>
      <p>
        I don't plan on making a native iPhone or Android app for this site.
        However, you can add Gigmap to your home screen for easy access.
      </p>
      <p>I'm still working on adding features. Here's what I want to add:</p>
      <ul>
        <li>Being able to mark venues and categories as 'favourites'</li>
        <li>Being able to see events around you.</li>
      </ul>
      <p>
        You can <a href="mailto:harryludson@gmail.com">send me an email</a> if
        you have any questions or suggestions.
      </p>
      <Link to="/">Back to the app</Link>
    </div>
  </Layout>
);

export default SecondPage;
