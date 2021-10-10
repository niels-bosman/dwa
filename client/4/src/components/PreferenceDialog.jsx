import React from 'react';

export class PreferenceDialog extends React.Component {

  state = { itemAmount: this.props.itemAmount, color: this.props.color };

  onAmountChange = ({ target }) => this.setState({ itemAmount: parseInt(target.value) });

  onColorChange = ({ target }) => this.setState({ color: target.value });

  render() {
    const validAmountInput = this.state.itemAmount <= this.props.maxItems && this.state.itemAmount > 0;

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
              value={this.state.itemAmount}
              onChange={this.onAmountChange}
              max={this.props.maxItems}
              min={1}
            />
            items in the list.
          </label>
          <label htmlFor="colorField">
            color:
            <select value={this.state.color} onChange={this.onColorChange} id="colorField">
              <option>orange</option>
              <option>green</option>
              <option>brown</option>
            </select>
          </label>
          <div className="dialogButtons">
            <button onClick={() => this.props.onSave(this.state.itemAmount, this.state.color)}>OK</button>
            <button onClick={() => this.props.onCancel()}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}