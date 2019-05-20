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
      <p><strong>Hi! You've probably noticed this isn't working anymore. Beat Magazine updated their website. I'll try to get around to updating this, but it might be a while.</strong></p>
      <p>
        Gigmap is a little app that shows you what's going on around Melbourne.
      </p>
      <p>
        Information comes from{" "}
        <a href="http://www.beat.com.au/gig-guide">Beat Magazine's gig guide</a>
        .
      </p>
      <p>
        This app was made using <a href="http://gatsbyjs.org">Gatsby</a>,{" "}
        <a href="https://reactjs.org">React</a>,{" "}
        <a href="https://aws.amazon.com/s3/">Amazon S3</a> and{" "}
        <a href="https://netlify.com">Netlify</a>.
      </p>
      <p>
        There are no plans to make a native iPhone or Android app for this site.
        However, you can add Gigmap to your home screen for easy access.
      </p>
      <p>This project is open source. If you'd like to contribute, <a href="https://www.github.com/larryhudson/gigmap">you can find the project on GitHub</a>.</p>
      <p>
        You can <a href="mailto:harryludson@gmail.com">send me an email</a> if
        you have any questions or suggestions.
      </p>
      <Link to="/">Back to the app</Link>
    </div>
  </Layout>
);

export default SecondPage;
