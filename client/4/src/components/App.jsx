import React from 'react';

import { ItemList } from './ItemList';
import { IFrameArea } from './IFrameArea';
import { PreferenceDialog } from './PreferenceDialog';

export class RrHNApp extends React.Component {
  state = {
    items:         [],
    statuses:      [],
    selected:      null,
    dialogVisible: false,
    color:         'orange',
    amountOfItems: 60
  };

  onSelectItem = async selected => {
    await this.setItemSelected(selected);
    this.setState({ selected });
    await this.fetchStatuses();
  };

  markAllVisibleAsSeen = async () => {
    const itemsToMark = this.state.items.slice(0, this.state.amountOfItems);

    for (const item of itemsToMark) {
      await this.setItemSelected(item.id);
    }
  };

  togglePreferenceDialog = () => {
    this.setState(({ dialogVisible }) => ({ dialogVisible: !dialogVisible }));
  };

  savePreferences = (amountOfItems, color) => {
    this.setState({ amountOfItems, color });
    this.togglePreferenceDialog();
  };

  fetchItems = async () => {
    const items = await fetch('http://localhost:3000/hn/topstories');
    this.setState({ items: await items.json() });
  };

  setItemSelected = async id => {
    await fetch(`http://localhost:3000/itemStatuses/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'text/plain' },
      body:    'seen',
    });
  };

  fetchStatuses = async () => {
    const statuses = await fetch('http://localhost:3000/itemStatuses');
    this.setState({ statuses: await statuses.json() });
  };

  async componentDidMount() {
    await this.fetchItems();
    await this.fetchStatuses();
  }

  render() {
    return (
      <div className={`App ${this.state.color}`}>
        <div id="ListPanel">
          <div className="ItemList">
            <header id="ListHeader" className="panelHeader">
              <div className="Logo">
                <div className="colored">RrHN</div>
                <div className="title">React-redux Hacker News</div>
              </div>
              <span className="settingsIcon" onClick={this.togglePreferenceDialog}>
                <svg width="20" height="20" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1152 896q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm512-109v222q0 12-8 23t-20 13l-185 28q-19 54-39 91 35 50 107 138 10 12 10 25t-9 23q-27 37-99 108t-94 71q-12 0-26-9l-138-108q-44 23-91 38-16 136-29 186-7 28-36 28h-222q-14 0-24.5-8.5t-11.5-21.5l-28-184q-49-16-90-37l-141 107q-10 9-25 9-14 0-25-11-126-114-165-168-7-10-7-23 0-12 8-23 15-21 51-66.5t54-70.5q-27-50-41-99l-183-27q-13-2-21-12.5t-8-23.5v-222q0-12 8-23t19-13l186-28q14-46 39-92-40-57-107-138-10-12-10-24 0-10 9-23 26-36 98.5-107.5t94.5-71.5q13 0 26 10l138 107q44-23 91-38 16-136 29-186 7-28 36-28h222q14 0 24.5 8.5t11.5 21.5l28 184q49 16 90 37l142-107q9-9 24-9 13 0 25 10 129 119 165 170 7 8 7 22 0 12-8 23-15 21-51 66.5t-54 70.5q26 50 41 98l183 28q13 2 21 12.5t8 23.5z"/>
                </svg>
             </span>
            </header>

            <div id="ListMainContent">
              <ItemList
                items={this.state.items}
                statuses={this.state.statuses}
                selected={this.state.selected}
                amount={this.state.amountOfItems}
                onSelectItem={this.onSelectItem}
              />
              <p onClick={this.markAllVisibleAsSeen}>
                Mark all items as 'seen'
              </p>
            </div>

            <footer id="ListFooter">
              visual design based on
              <a href="http://blog.trackduck.com/weekly/top-10-hacker-news-redesigns/unknown-author-2/">
                this redesign by unknown author
              </a>.
            </footer>
          </div>
        </div>

        <div id="ContentPanel" className={this.state.dialogVisible ? 'preferences' : 'item'}>
          {
            this.state.dialogVisible
              ? <PreferenceDialog
                itemAmount={this.state.amountOfItems}
                maxItems={this.state.items.length}
                color={this.state.color}
                onCancel={this.togglePreferenceDialog}
                onSave={this.savePreferences}
              />
              : this.state.selected !== null
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
