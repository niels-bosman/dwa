import React from 'react';

import ListItem from './ListItem';

const ItemList = ({ items, amount, statuses, onSelectItem }) => {
  return items.slice(0, amount).map(item => (
    <ListItem
      item={item}
      status={statuses[item.id] ?? null}
      key={item.id}
      onSelectItem={onSelectItem}
    />
  ));
};

export default ItemList;
