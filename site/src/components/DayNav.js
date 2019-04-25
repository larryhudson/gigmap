import styled from 'styled-components'
import moment from 'moment-timezone'
import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import config from '../../../scrape/config'


const FlexContainer = styled.div`
display: flex;
justify-content: space-between;
margin-bottom: 0;
`

const FlexItem = styled.div`
width: 90%;
margin: 0;

a {
	background: ${props => props.isCurrent ? 'gold' : 'white' };
}
`

const DateLink = styled(Link)`
padding: 0.25em 0.5em;
color: black;
text-decoration: none;
width: 100%;
display: block;
text-align: center;
border: 1px solid black;
`

function dayStr(date) {
	return moment.tz(date, config.timezone).format('ddd')
}

function dPath(date, today) {
	if (date === today) {
		return '/'
	} else {
		return '/day/' + moment.tz(date, config.timezone).format('DD-MM-YYYY')
	}
}

function DayNav({current}) {
  const dateQuery = useStaticQuery(graphql`
	{
      dates: allEventsJson {
	    group(field: date) {
	      fieldValue
	    }
	  }
    }
  `)
  const today = dateQuery.dates.group[0].fieldValue
  const dates = dateQuery.dates.group

  return (
  	<FlexContainer>
		{dates.map(({fieldValue: date}) => {
			return <FlexItem key={dPath(date, today)} isCurrent={(date === current)}>
				<DateLink to={dPath(date, today) }>{dayStr(date)}</DateLink>
			</FlexItem>
		})}
    </FlexContainer>
  );
}

export default DayNav