import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { NavBar } from './NavBar';
import { Home } from './Home';
import { About } from './About';
import { NotFound } from './NotFound';
import { Login } from './Login';
import { Logout } from './Logout';
import { Delays } from './Delays';
import { AddDelay } from './AddDelay';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="app">
          <NavBar/>

          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
            <Route path="/delays" component={Delays}/>
            <Route path="/adddelay" component={AddDelay}/>
            <Route path="/login" component={Login}/>
            <Route path="/logout" component={Logout}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
