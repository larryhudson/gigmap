import React, { useState, useEffect } from "react";
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
import { getAllGenreIds } from "../consts/genres";
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

// function sortById(a, b) {
//   if (a.fieldValue < b.fieldValue) return -1;
//   if (a.fieldValue > b.fieldValue) return 1;
//   return 0;
// }

export default ({ data, pageContext }) => {
  let initialGenres, initialView;

  if (
    typeof sessionStorage !== "undefined" &&
    sessionStorage.getItem("showingGenreIds")
  ) {
    initialGenres = JSON.parse(sessionStorage.getItem("showingGenreIds"));
  } else {
    initialGenres = getAllGenreIds();
  }

  const [showingGenreIds, setShowingGenreIds] = useState(initialGenres);

  useEffect(() => {
    sessionStorage.setItem("showingGenreIds", JSON.stringify(showingGenreIds));
  }, [showingGenreIds]);

  if (
    typeof sessionStorage !== "undefined" &&
    sessionStorage.getItem("currentView")
  ) {
    initialView = sessionStorage.getItem("currentView");
  } else {
    initialView = "map";
  }

  const [view, setView] = useState(initialView);

  useEffect(() => {
    sessionStorage.setItem("currentView", view);
  }, [view]);

  const [showingFilters, setShowingFilters] = useState(null);

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

  function selectAllGenres() {
    setShowingGenreIds(getAllGenreIds());
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

  const todayGenres = data.eventsByGenre.group;
  const allGenreIds = getAllGenreIds();
  const { date } = pageContext;
  const showingMap = view === "map";
  const showingList = view === "list";
  const noGenres = showingGenreIds.length === 0;
  const showingGenres = todayGenres.filter(genre =>
    showingGenreIds.includes(genre.fieldValue)
  );
  return (
    <Layout>
      <Header title={moment(date).format("dddd DD MMMM")} />
      <SEO
        title={moment(date).format("dddd DD MMMM")}
        keywords={[`music`, `melbourne`]}
      />
      <DayNav current={date} />
      {noGenres && (
        <div style={{marginTop: "20px"}}>
          <h3>No categories selected</h3>
          <p>
            Please use the 'Filter by category' button below to choose some
            categories.
          </p>
        </div>
      )}
      {!noGenres && (
        <div>
          {showingList && <GenreEventsList genres={showingGenres} date={date} />}
          {showingMap && <MainMap genres={showingGenres} />}
        </div>
      )}
      <BottomButtons
        onToggleFilters={toggleFilters}
        onChangeView={changeView}
        currentView={view}
      />
      {showingFilters && (
        <GenreFilters
          allGenreIds={allGenreIds}
          showingGenreIds={showingGenreIds}
          onGenreChange={handleGenreChange}
          onToggleFilters={toggleFilters}
          onSelectAll={selectAllGenres}
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
