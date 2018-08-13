import React, { Component } from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';
import Points from './Points';
import Axis from './Axis';

class Scatterplot extends Component {
  render() {
    var innerWidth =
      this.props.width - this.props.marginLeft - this.props.marginRight;
    var innerHeight =
      this.props.height - this.props.marginTop - this.props.marginBottom;
    var innerTransform = `translate(${this.props.marginLeft},${
      this.props.marginTop
    })`;

    var xDomain =
      this.props.xDomain || d3.extent(this.props.data, this.props.x);
    var yDomain =
      this.props.yDomain || d3.extent(this.props.data, this.props.y);

    var xScale = this.props.xScale.domain(xDomain).range([0, innerWidth]);

    var yScale = this.props.yScale.domain(yDomain).range([innerHeight, 0]);

    var xValue = d => xScale(this.props.x(d));
    var yValue = d => yScale(this.props.y(d));
    var rValue = d => this.props.r(d);
    var fillValue = d => this.props.fill(d);
    var strokeValue = d => this.props.stroke(d);

    var pointsData = this.props.data.map(d => {
      return {
        ...d,
        x: xValue(d),
        y: yValue(d),
        r: rValue(d),
        fill: fillValue(d),
        stroke: strokeValue(d)
      };
    });

    var bottomAxisTransform = `translate(0,${innerHeight})`;

    return (
      <svg
        className="Scatterplot"
        width={this.props.width}
        height={this.props.height}
      >
        <g transform={innerTransform}>
          <Points data={pointsData} />

          <g transform={bottomAxisTransform}>
            <Axis
              orientation="bottom"
              scale={xScale}
              tickArguments={this.props.xTickArguments}
            />
          </g>

          <Axis
            orientation="left"
            scale={yScale}
            tickArguments={this.props.yTickArguments}
          />
        </g>
      </svg>
    );
  }
}

Scatterplot.propTypes = {
  marginTop: PropTypes.number,
  marginLeft: PropTypes.number,
  marginBottom: PropTypes.number,
  marginRight: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  x: PropTypes.func,
  y: PropTypes.func,
  r: PropTypes.func,
  fill: PropTypes.func,
  stroke: PropTypes.func,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  xTickArguments: PropTypes.array,
  yTickArguments: PropTypes.array,
  data: PropTypes.array.isRequired,
  xScale: PropTypes.func,
  yScale: PropTypes.func
};

Scatterplot.defaultProps = {
  marginTop: 10,
  marginLeft: 30,
  marginBottom: 30,
  marginRight: 30,
  width: 960,
  height: 500,
  x: d => d.x,
  y: d => d.y,
  r: () => 4,
  fill: () => '#000',
  stroke: () => 'none',
  xTickArguments: [],
  yTickArguments: [],
  xScale: d3.scale.linear(),
  yScale: d3.scale.linear()
};

export default Scatterplot;
