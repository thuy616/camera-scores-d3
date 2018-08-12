import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Points extends Component {
  static propTypes = {
    data: PropTypes.array
  };

  render() {
    var circles = this.props.data.map((d, i) => {
      return (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill={d.fill}
          stroke={d.stroke}
        />
      );
    });
    return <g className="Points">{circles}</g>;
  }
}

export default Points;
