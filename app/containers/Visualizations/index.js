import React, { Component } from 'react';
import CameraDataTableContainer from '../DataTableContainer';
import ScoreScatterPlot from '../ScoreScatterPlot';

const viewTypes = {
  list: 'list',
  chart: 'chart'
};

export default class Visualizations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedView: viewTypes.chart
    };
    this.handleButtonIconClick = this.handleButtonIconClick.bind(this);
  }

  handleButtonIconClick(value) {
    this.setState({
      selectedView: value
    });
  }

  render() {
    return (
      <div>
        <div>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => this.handleButtonIconClick(viewTypes.list)}
          >
            <i className="fa fa-list fa-2x" />
          </button>
          |
          <button
            type="button"
            className="btn btn-light"
            onClick={() => this.handleButtonIconClick(viewTypes.chart)}
          >
            <i className="fa fa-line-chart fa-2x" />
          </button>
        </div>
        {this.state.selectedView === viewTypes.chart ? (
          <ScoreScatterPlot />
        ) : (
          <CameraDataTableContainer />
        )}
      </div>
    );
  }
}
