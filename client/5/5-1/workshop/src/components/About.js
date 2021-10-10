import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';

const AboutPath = '/about';

const About = () => (
  <div className="page columns">
    <div className="sidebar">
      <NavLink to={`${AboutPath}/team`}>Team</NavLink>
      <NavLink to={`${AboutPath}/contact`}>Contact</NavLink>
    </div>
    <div className="content">
      <Switch>
        <Route path={`${AboutPath}/team`} component={AboutTeam}/>
        <Route path={`${AboutPath}/contact`} component={AboutContact}/>
        <Route component={AboutDefault}/>
      </Switch>
    </div>
  </div>
);

const AboutDefault = () => <p>Here you can read about us</p>;

const AboutTeam = () => <p>This is the team for you</p>;

const AboutContact = () => <p>You can contact us</p>;

export { About };