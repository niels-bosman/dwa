import React from 'react';

const IFrameArea = ({ item: { title, url } }) => {
  return (
    <iframe
      className="IFrameView"
      title={title}
      src={url}
      frameBorder="0"
      sandbox="allow-forms allow-modals allow-popups allow-scripts allow-same-origin"
    />
  );
};

export default IFrameArea;
