import React from 'react';

import frontPageItems from '../frontpageData';
import { ItemList } from './ItemList';
import { IFrameArea } from './IFrameArea';

export class RrHNApp extends React.Component {
  state = { items: frontPageItems, selected: null };

  onSelectItem = selected => this.setState({ selected });

  render() {
    return (
      <div className="App">
        <div id="ListPanel">
          <div className="ItemList">
            <div className="Logo">
              <div className="colored">RRHN</div>
              <div className="title">Hacker News</div>
            </div>

            <div id="ListMainContent">
              <ItemList items={this.state.items} onSelectItem={this.onSelectItem}/>
            </div>

            <div id="ListFooter">
              visual design based on
              <a href="http://blog.trackduck.com/weekly/top-10-hacker-news-redesigns/unknown-author-2/">
                this redesign by unknown author
              </a>.
            </div>
          </div>
        </div>

        <div id="ItemPanel">
          {
            this.state.selected
              ? <IFrameArea item={this.state.selected}/>
              : (
                <div>
                  <h2>No item selected yet.</h2>
                  <p>Select an item in the colum on the left.</p>
                </div>
              )
          }
        </div>
      </div>
    );
  }
}
