import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Points extends Component {
  static propTypes = {
    data: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
  }

  handleOnMouseOver(d, e) {
    let tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.left = `${e.pageX + 10}px`;
    tooltip.style.top = `${e.pageY + 10}px`;

    let imageElem = document.createElement('img');
    imageElem.src = d.image;
    imageElem.height = 30;
    tooltip.appendChild(imageElem);
    let innerDivElem = document.createElement('div');
    innerDivElem.innerHTML = `
      ${d.brand} ${d.name}<br/>
      Resolution ${d.specs.find(spec => spec.key === 'Pixels').value}
    `;
    tooltip.appendChild(innerDivElem);
    document.body.appendChild(tooltip);
  }

  handleOnMouseOut() {
    let body = document.body;
    let tooltip = document.getElementsByClassName('tooltip')[0];
    body.removeChild(tooltip);
  }

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
          onMouseOver={e => this.handleOnMouseOver(d, e)}
          onMouseOut={() => this.handleOnMouseOut()}
        />
      );
    });
    return <g className="Points">{circles}</g>;
  }
}

export default Points;
