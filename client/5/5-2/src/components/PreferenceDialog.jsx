import React, { useState } from 'react';

const PreferenceDialog = ({ itemAmount, color, maxItems, onSave, ...rest }) => {
  const [localAmount, setLocalAmount] = useState(itemAmount);
  const [localColor, setLocalColor]   = useState(color);

  const onAmountChange = e => setLocalAmount(parseInt(e.target.value));
  const onColorChange  = e => setLocalColor(e.target.value);

  const validAmountInput = localAmount <= maxItems && localAmount > 0;

  return (
    <div id="ContentPanel" className="preferences">
      <div className="PreferencesDialog">
        <header>
          <div className="Logo">
            <div className="colored">RrHN</div>
            <div className="title">Settings</div>
          </div>
        </header>
        <label htmlFor="listSizeField">
          Show
          <input
            type="number"
            id="listSizeField"
            className={!validAmountInput ? 'warning' : ''}
            value={localAmount}
            onChange={onAmountChange}
            max={maxItems}
            min={1}
          />
          items in the list.
        </label>
        <label htmlFor="colorField">
          color:
          <select value={localColor} onChange={onColorChange} id="colorField">
            <option>orange</option>
            <option>green</option>
            <option>brown</option>
          </select>
        </label>
        <div className="dialogButtons">
          <button onClick={() => {
            onSave(localAmount, localColor);
            rest.history.goBack();
          }}>OK
          </button>
          <button onClick={() => rest.history.goBack()}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PreferenceDialog;