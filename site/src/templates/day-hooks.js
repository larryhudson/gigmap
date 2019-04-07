import React, { useState } from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import MainMap from "../components/MainMap";
import GenreFilters from "../components/genreFilters";
import BottomButtons from "../components/bottomButtons";
import GenreEventsList from "../components/GenreEventsList";
import DayNav from "../components/DayNav";
import moment from "moment-timezone";
import Header from "../components/header";
import {getAllGenreIds} from "../consts/genres";
// import { Machine, assign } from "xstate";
// import { useMachine } from "@xstate/react";

// const dayMachine = Machine({
//   id: "day",
//   initial: "map",
//   context: {
//     genres: allGenres,
//     balloon: null
//   },
//   states: {
//     map: {
//     },
//     list: {}
//   },
//   on: {

//   }
// });

// const filtersMachine = Machine({
//   id: "filters",
//   initial: "closed",
//   states: {
//     filtersOpen: {
//       on: {
//         CLOSE: "closed",
//         TICK: AddToGenres,
//         UNTICK: RemoveFromGenres
//       }
//     },
//     filtersClosed: {
//       on: {
//         OPEN: "opened"
//       }
//     }
//   }
// });

function sortById(a, b) {
  if (a.fieldValue < b.fieldValue) return -1;
  if (a.fieldValue > b.fieldValue) return 1;
  return 0;
}

export default ({ location, data, pageContext }) => {
  let initialGenreIds = location.state.showingGenreIds ? location.state.showingGenreIds : getAllGenreIds();
  
  const [showingGenreIds, setShowingGenreIds] = useState(
    initialGenreIds
  );
  const [showingFilters, setShowingFilters] = useState(null);
  const [view, setView] = useState("map");

  function handleGenreChange(e) {
    const thisGenreId = e.target.name;

    if (e.target.checked === true) {
      // add genre to state array
      setShowingGenreIds(previousGenreIds =>
        [...previousGenreIds, thisGenreId].sort()
      );
    } else {
      // remove genre from array
      setShowingGenreIds(previousGenreIds =>
        previousGenreIds.filter(genreId => !(genreId === thisGenreId)).sort()
      );
    }
  }

  function toggleFilters() {
    if (showingFilters === null) {
      setShowingFilters(true);
    } else {
      setShowingFilters(null);
    }
  }

  function changeView() {
    if (view === "map") {
      setView("list");
    } else {
      setView("map");
    }
  }

  const allGenres = data.eventsByGenre.group;
  const { date } = pageContext;
  const showingMap = view === "map";
  const showingList = view === "list";
  const showingGenres = allGenres.filter(genre => showingGenreIds.includes(genre.fieldValue))
  return (
    <Layout>
      <Header title={moment(date).format("dddd DD MMMM")} />
      <SEO
        title={moment(date).format("dddd DD MMMM")}
        keywords={[`music`, `melbourne`]}
      />
      <DayNav current={date} showingGenreIds={showingGenreIds} />
      <MainMap genres={showingGenres} showing={showingMap} />
      {showingList && <GenreEventsList genres={showingGenres} date={date} />}
      <BottomButtons
        onToggleFilters={toggleFilters}
        onChangeView={changeView}
      />
      {showingFilters && (
        <GenreFilters
          allGenres={allGenres}
          showingGenres={showingGenres}
          onGenreChange={handleGenreChange}
          onToggleFilters={toggleFilters}
        />
      )}
    </Layout>
  );
};

export const pageQuery = graphql`
  query($date: String!) {
    eventsByGenre: allEventsJson(filter: { date: { eq: $date } }) {
      group(field: genre) {
        fieldValue
        totalCount
        edges {
          node {
            slug
            title
            genre
            mainArtist {
              name
            }
            startTime
            supports {
              name
            }
            date(formatString: "dddd DD MMMM")
            price
            venue {
              name
              venueURL
              coords {
                lat
                lng
              }
            }
          }
        }
      }
    }
  }
`;
