import React from 'react';

import { ListItem } from './ListItem';

export class ItemList extends React.Component {
  render() {
    let items;

    if (this.props.amount <= this.props.items.length) {
      items = this.props.items.slice(0, this.props.amount);
    } else {
      items = this.props.items;
    }

    return items.map(item => (
      <ListItem
        item={item}
        selected={this.props.selected?.id === item.id}
        status={this.props.statuses[item.id] ?? null}
        key={item.id}
        onSelectItem={this.props.onSelectItem}
      />
    ));
  }
}
