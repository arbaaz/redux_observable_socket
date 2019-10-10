import React, { Component } from "react";
import PropTypes from "prop-types";

class Counter extends Component {
  render() {
    const { onIncrement, onDecrement, value } = this.props;
    return (
      <div>
        <button onClick={onIncrement}>Subscribe BTCUSD</button>{" "}
        <button onClick={onDecrement}>Subscribe BTCUSD_27Dec</button> <br />
        {value.symbol}- {value.volume} - {value.timestamp}
      </div>
    );
  }
}

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired
};

export default Counter;
