import React from 'react';

export class ListItem extends React.Component {

  handleTitleClick = event => {
    event.preventDefault();
    this.props.onSelectItem(this.props.item);
  };

  render() {
    const { by, descendants, score, time, title, url } = this.props.item;

    return (
      <div className="Item" onClick={this.handleTitleClick}>
        <div className="mainInfo">
          <div>
            <a className="itemTitle" href={url}>{title}</a>
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
  }
}