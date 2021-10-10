import React from 'react';

import DataAPI from '../api/DataAPI';
import { NavLink, Route } from 'react-router-dom';

export const Delays = () => (
  <div className="page columns">
    <div className="sidebar">
      <DelaysList/>
    </div>

    <div className="content">
      <Route path="/delays/date/:dateId" component={DelaysOnDate}/>
    </div>
  </div>
);

const DelaysOnDate = props => {
  const dateId = props.match.params.dateId;
  const delays = DataAPI.getDelaysOnDate(dateId);

  return (
    <div className="content">
      {delays.length > 0 ? (
        delays.map(({ id, fromLocation, to, minutesHuman }) => (
          <p key={id}>
            from {fromLocation} to {to} - {minutesHuman} delay
          </p>
        ))
      ) : (
        <p>No delays for this date.</p>
      )}
    </div>
  );
};

const DelaysList = () => {
  const delayDates = DataAPI.getDistinctDates();

  return delayDates.map(({ date, dateHuman }) => (
    <NavLink key={date} to={`/delays/date/${date}`}>
      {dateHuman}
    </NavLink>
  ));
};