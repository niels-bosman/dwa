import React, { useEffect, useState } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import ItemList from './ItemList';
import IFrameArea from './IFrameArea';
import EmptyPanel from './EmptyPanel';
import PreferenceDialog from './PreferenceDialog';

const RhNHApp = () => {
  const [items, setItems]                 = useState([]);
  const [statuses, setStatuses]           = useState([]);
  const [color, setColor]                 = useState('orange');
  const [amountOfItems, setAmountOfItems] = useState(60);

  useEffect(() => {
    const fetch = async () => await Promise.all([fetchItems(), fetchStatuses()]);
    fetch();
  }, []);

  const onSelectItem = async id => {
    await setItemSelected(id);
    await fetchStatuses();
  };

  const markAllVisibleAsSeen = async () => {
    const itemsToMark = items.slice(0, amountOfItems);

    for (const item of itemsToMark) {
      await setItemSelected(item.id);
    }

    await fetchStatuses();
  };

  const savePreferences = (amountOfItems, color) => {
    setAmountOfItems(amountOfItems);
    setColor(color);
  };

  const findItemById = id => items.find(item => item.id === parseInt(id));

  const fetchItems = async () => {
    const items = await fetch('http://localhost:3000/hn/topstories');
    setItems(await items.json());
  };

  const setItemSelected = async id => {
    await fetch(`http://localhost:3000/itemStatuses/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'text/plain' },
      body:    'seen',
    });
  };

  const fetchStatuses = async () => {
    const statuses = await fetch('http://localhost:3000/itemStatuses');
    setStatuses(await statuses.json());
  };

  return (
    <div className={`App ${color}`}>
      <div id="ListPanel">
        <div className="ItemList">
          <header id="ListHeader" className="panelHeader">
            <div className="Logo">
              <div className="colored">RrHN</div>
              <div className="title">React-redux Hacker News</div>
            </div>
            <Link to="/preferences" className="settingsIcon">
              <svg width="20" height="20" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1152 896q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm512-109v222q0 12-8 23t-20 13l-185 28q-19 54-39 91 35 50 107 138 10 12 10 25t-9 23q-27 37-99 108t-94 71q-12 0-26-9l-138-108q-44 23-91 38-16 136-29 186-7 28-36 28h-222q-14 0-24.5-8.5t-11.5-21.5l-28-184q-49-16-90-37l-141 107q-10 9-25 9-14 0-25-11-126-114-165-168-7-10-7-23 0-12 8-23 15-21 51-66.5t54-70.5q-27-50-41-99l-183-27q-13-2-21-12.5t-8-23.5v-222q0-12 8-23t19-13l186-28q14-46 39-92-40-57-107-138-10-12-10-24 0-10 9-23 26-36 98.5-107.5t94.5-71.5q13 0 26 10l138 107q44-23 91-38 16-136 29-186 7-28 36-28h222q14 0 24.5 8.5t11.5 21.5l28 184q49 16 90 37l142-107q9-9 24-9 13 0 25 10 129 119 165 170 7 8 7 22 0 12-8 23-15 21-51 66.5t-54 70.5q26 50 41 98l183 28q13 2 21 12.5t8 23.5z"/>
              </svg>
            </Link>
          </header>

          <div id="ListMainContent">
            <ItemList
              items={items}
              statuses={statuses}
              amount={amountOfItems}
              onSelectItem={onSelectItem}
            />
            <p onClick={markAllVisibleAsSeen}>
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

      <div id="ContentPanel" className={'item'}>
        <Switch>
          <Route exact path="/" component={EmptyPanel}/>
          <Route path="/preferences" render={(routeProps) => (
            <PreferenceDialog
              itemAmount={amountOfItems}
              maxItems={items.length}
              color={color}
              onSave={savePreferences}
              {...routeProps}
            />
          )}/>
          {
            items.length > 0 && (
              <Route path="/item/:itemId" render={routeProps => (
                <IFrameArea item={findItemById(routeProps.match.params.itemId)}/>
              )}/>
            )
          }
        </Switch>
      </div>
    </div>
  );
};

export default RhNHApp;