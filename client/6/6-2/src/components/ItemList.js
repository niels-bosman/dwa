import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

import parseUrl from 'url-parse';
import Moment from 'moment';

import { Logo } from './Logo';
import { SettingsIcon } from './Preferences';

import { fetchHNItems, fetchStatuses, markAsSeen, showPrefsAction, toggleItemStatus, } from '../reducers';

//============================================================================
//  The React component that renders the UI for the ItemList
//----------------------------------------------------------------------------

const ItemList = (props) => {
  // What pieces of the Redux Store should be passed to the ItemListUI as data-props?
  const statuses     = useSelector((state) => state.hnItems.statuses);
  const listSize     = useSelector((state) => state.prefs.currentListSize);
  const selectedItem = useSelector((state) => state.hnItems.selectedItem);
  const items        = useSelector((state) => state.hnItems.items);
  const itemsLoading = useSelector((state) => state.hnItems.itemsLoading);
  const error        = useSelector((state) => state.hnItems.error);

  // What functions does the ItemListUI need to change the App state?
  // Note how all functions merely create an Action (using a parameter if needed)
  //   that they send to the reducers by calling the Redux-supplied function 'dispatch'.
  // function mapDispatchToProps(dispatch) {
  //   return {
  //     doShowPrefs: () => dispatch(showPrefsAction()),
  //     onMarkAsSeen: listSize => dispatch(markAsSeenAction(listSize)),
  //     onToggleItem: item => dispatch(toggleItemAction(item))
  //   };
  // }
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHNItems());
    dispatch(fetchStatuses());
  }, [dispatch]);

  const itemsToShow = items.slice(0, listSize); // this also works when listSize > items.length.

  const theItems = itemsToShow.map((itm, idx) => (
    <Item
      item={itm}
      status={statuses[itm.id]}
      key={itm.id}
      isSelected={selectedItem && itm.id === selectedItem.id}
      onToggleItem={() => dispatch(toggleItemStatus(itm))}
    />
  ));

  return (
    <div className="ItemList">
      <ListHeader doShowPrefs={() => dispatch(showPrefsAction())}/>

      {itemsLoading ? (
        <Loader
          type="Puff"
          color="orange"
          height={100}
          width={100}
          timeout={3000} //3 secs
        />
      ) : (
        <div id="ListMainContent">{theItems}</div>
      )}

      {error && <ErrorMessage message={error}/>}

      <button id="markAsSeen" onClick={() => dispatch(markAsSeen(listSize))}>
        Mark all items as “seen”
      </button>
      <ListFooter/>
    </div>
  );
};
//============================================================================
//  Connecting the ItemListUI to the Redux Store results in a new
//  React component that can talk to the Store, and provide the UI-component
//  with both data-props and props containing functions to change the store.
//----------------------------------------------------------------------------

// Here a new React component is created that will contain the ItemListUI, and
// supply it with all the data and functions as props.
// This connected version of the ItemList component is the one we export to the
// rest of the app.

export { ItemList };

//============================================================================
//  A bunch of functional components to help render parts of the ItemList.
//  Note how we choose not to connect the ListItem component. It can get its
//  data and functions in the normal react way, because it was never a stateful
//  component.
//----------------------------------------------------------------------------
const ErrorMessage = (props) => {
  return <button id="errorMessage">{props.message}</button>;
};

function ListHeader(props) {
  return (
    <header id="ListHeader" className="panelHeader">
      <Logo/>{' '}
      <span className="settingsIcon" onClick={props.doShowPrefs}>
        <SettingsIcon/>
      </span>
    </header>
  );
}

function ListFooter(props) {
  return (
    <footer id="ListFooter">
      visual design based on{' '}
      <a href="http://blog.trackduck.com/weekly/top-10-hacker-news-redesigns/unknown-author-2/">
        this redesign by unknown author
      </a>
      .
    </footer>
  );
}

function Item(props) {
  let statusText;
  switch (props.status) {
    case 'read':
      statusText = 'already read';
      break;
    case 'seen':
      statusText = 'seen before';
      break;
    default:
      statusText = 'new';
  }
  let domain;
  if (props.item.url) {
    let hostname = parseUrl(props.item.url).hostname;
    if (hostname.startsWith('www.')) {
      hostname = hostname.substr(4);
    }
    domain = (
      <span className="domain">
        &emsp;({hostname}, {statusText})
      </span>
    );
  }
  // let timeAgo = Moment.unix(props.item.time).fromNow();
  let timeAgo = Moment.unix(props.item.time).format('LL');
  let comments;
  if (props.item.descendants !== undefined) {
    let commentsUrl =
          'https://news.ycombinator.com/item?id=' +
          encodeURIComponent(props.item.id);
    comments        = (
      <a className="comments" href={commentsUrl}>
        <strong>{props.item.descendants}</strong> comments
      </a>
    );
  }
  let clickHandler = (evt) => {
    evt.preventDefault();
    props.onToggleItem(props.item);
  };
  let cssClasses   = 'Item ';
  cssClasses += props.status || 'new';
  if (props.isSelected) {
    cssClasses += ' selectedItem';
  }

  return (
    <div className={cssClasses}>
      <div className="mainInfo">
        <div>
          <a className="itemTitle" href={props.item.url} onClick={clickHandler}>
            {props.item.title}
          </a>
          {domain}
        </div>
        <div className="info">
          {props.item.score} points
          <span className="divider">|</span>
          by {props.item.by}
          <span className="divider">|</span>
          {timeAgo}
          <span className="divider">|</span>
          {comments}
        </div>
      </div>
    </div>
  );
}
