// import * as d3 from 'd3';
import React, { Component } from 'react';

const top = 1;
const right = 2;
const bottom = 3;
const left = 4;
// const epsilon = 1e-6;

function translateX(scale0, scale1, d) {
  const x = scale0(d);
  return `translate(${isFinite(x) ? x : scale1(d)},0)`;
}

function translateY(scale0, scale1, d) {
  const y = scale0(d);
  return `translate(0,${isFinite(y) ? y : scale1(d)})`;
}

let identity = x => x;

const orientations = {
  top: 1,
  right: 2,
  bottom: 3,
  left: 4
};

class Axis extends Component {
  render() {
    const orient = orientations[this.props.orientation] || 4;
    const scale = this.props.scale;

    let tickArguments = this.props.tickArguments;
    let tickValues = null;
    let tickFormat = null;
    let tickSizeInner = 6;
    let tickSizeOuter = 6;
    let tickPadding = 3;

    var values =
      tickValues === null
        ? scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()
        : tickValues;

    var format =
      tickFormat === null
        ? scale.tickFormat
          ? scale.tickFormat.apply(scale, tickArguments)
          : identity
        : tickFormat;

    let spacing = Math.max(tickSizeInner, 0) + tickPadding;
    let transform =
      orient === top || orient === bottom ? translateX : translateY;
    let range = scale.range();
    let range0 = range[0] + 0.5;
    let range1 = range[range.length - 1] + 0.5;
    let position = (scale.bandwidth ? center : identity)(scale.copy());
    let k = orient === top || orient === left ? -1 : 1;
    let x;
    let y =
      orient === left || orient === right ? ((x = 'x'), 'y') : ((x = 'y'), 'x');

    let lineProps = {
      [x + 2]: k * tickSizeInner,
      [y + 1]: 0.5,
      [y + 2]: 0.5
    };

    let textProps = {
      [x]: k * spacing,
      [y]: 0.5
    };

    let pathString =
      orient === left || orient === right
        ? 'M' +
          k * tickSizeOuter +
          ',' +
          range0 +
          'H0.5V' +
          range1 +
          'H' +
          k * tickSizeOuter
        : 'M' +
          range0 +
          ',' +
          k * tickSizeOuter +
          'V0.5H' +
          range1 +
          'V' +
          k * tickSizeOuter;

    var gTicks = values.map((d, i) => {
      return (
        <g
          className="tick"
          transform={transform(position, position, d)}
          key={i}
        >
          <line stroke="#000" {...lineProps} />
          <text
            fill="#000"
            textAnchor={
              orient === right ? 'start' : orient === left ? 'end' : 'middle'
            }
            {...textProps}
            dy={
              orient === top ? '0em' : orient === bottom ? '0.71em' : '0.32em'
            }
          >
            {format(d)}
          </text>
        </g>
      );
    });

    return (
      <g
        className="Axis"
        fill="none"
        fontSize="10"
        fontFamily="sans-serif"
        textAnchor="end"
      >
        <path d={pathString} stroke="#000" />
        {gTicks}
      </g>
    );
  }
}

Axis.propTypes = {
  orientation: React.PropTypes.string.isRequired,
  scale: React.PropTypes.func.isRequired,
  tickArguments: React.PropTypes.array
};

Axis.defaultProps = {
  tickArguments: []
};

export default Axis;
