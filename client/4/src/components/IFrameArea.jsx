import React from 'react';

export class IFrameArea extends React.Component {
  render() {
    return (
      <iframe
        className="IFrameView"
        title={this.props.item.title}
        src={this.props.item.url}
        frameBorder="0"
        sandbox="allow-forms allow-modals allow-popups allow-scripts allow-same-origin"
      />
    );
  }
}
