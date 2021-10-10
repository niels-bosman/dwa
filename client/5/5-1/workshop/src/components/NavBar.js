import React from 'react';
import { NavLink } from 'react-router-dom';

export class NavBar extends React.Component {

  render() {
    return (
      <nav>
        <NavLink exact to="/">Home</NavLink>
        <NavLink exact to="/about">About</NavLink>
        <NavLink exact to="/delays">Delays</NavLink>
        <NavLink exact to="/adddelay">Add delay</NavLink>
        <NavLink exact to="/login">Login</NavLink>
        <NavLink exact to="/logout">Logout</NavLink>
      </nav>
    );
  }
}
