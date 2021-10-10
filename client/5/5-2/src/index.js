import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';
// Using Webpack, we usually import CSS from JavaScript, not from HTML.
// This is not standard JavaScript, it's a Webpack feature
// that is popular in the React community.
import { BrowserRouter } from 'react-router-dom';
import RhNHApp from './components/App';

const app = () => {
  return (
    <BrowserRouter>
      <RhNHApp/>
    </BrowserRouter>
  );
};

ReactDOM.render(app(), document.getElementById('root'));
