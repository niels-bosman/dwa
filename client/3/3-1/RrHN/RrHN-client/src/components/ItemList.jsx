import React from 'react';

import { ListItem } from './ListItem';

export class ItemList extends React.Component {
  render() {
    return this.props.items.map(item => (
      <ListItem
        item={item}
        key={item.id}
        onSelectItem={this.props.onSelectItem}
      />
    ));
  }
}
