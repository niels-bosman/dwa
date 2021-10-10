import React from 'react';
import { Link } from 'react-router-dom';

const ListItem = ({ item: { id, by, descendants, score, time, title, url }, status, onSelectItem }) => {
  return (
    <div className={`Item new ${window.location.href.includes(id) && 'selectedItem'}`}>
      {status === 'seen' && 'Item read'}
      <div className="mainInfo">
        <div>
          <Link
            to={`/item/${id}`}
            onClick={() => onSelectItem(id)}
            className="itemTitle"
            href={url}
          >
            {title}
          </Link>
          <span className="domain">({url})</span>
        </div>
        <div className="info">
          {score} points
          <span className="divider">|</span>
          by {by}
          <span className="divider">|</span>
          {new Date(time).toDateString()}
          <span className="divider">|</span>
          <a className="comments" href="https://news.ycombinator.com/item?id=12115187">
            <strong>{descendants}</strong> comments
          </a>
        </div>
      </div>
    </div>
  );
};

export default ListItem;