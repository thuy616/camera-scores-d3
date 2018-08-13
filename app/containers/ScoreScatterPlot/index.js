import React, { Component } from 'react';
import d3 from 'd3';
import camerasData from '../../data/camerasData.json';

import Scatterplot from '../../components/ScatterPlot';

var width = 400;
var height = 320;

const yOptions = [
  {
    name: 'Sensor Overall Score',
    key: 'overall',
    description:
      'The Sensor Overall Score is an average of the three scores: the Portrait Score based on color depth, the Landscape Score based on dynamic range, and the Sports Score based on low-light ISO. However, the Sensor Overall Score does not show a camera’s resolution and ability to render fine detail, nor does it take into account optical aberrations, as those criteria depend on the lens used with the camera.'
  },
  {
    name: 'Portrait score: Color Depth',
    key: 'portrait',
    description:
      'Flash studio photography involves controlled lighting, and even when shooting hand-held, studio photographers rarely move from the lowest ISO setting of their cameras. What matters most when shooting products or portraits is a rich color rendition and color depth. The best image quality metric that correlates with color depth is color sensitivity, which indicates to what degree of subtlety color nuances can be distinguished from one another (and often means a hit or a miss on a pantone palette). Maximum color sensitivity reports in bits the number of colors that the sensor is able to distinguish.'
  },
  {
    name: 'Landscape score: Maximum Dynamic Range',
    key: 'landscape',
    description:
      'Landscape photographers carefully compose their images and choose the time of the day for shooting in the best light. This type of photography commonly involves mounting the camera on a tripod and using the lowest possible ISO setting to minimize noise. Unless there is motion in a scene, relatively long shutter speeds are not an issue with a tripod. On the other hand, dynamic range is paramount.'
  },
  {
    name: 'Sports & action score: Low-Light ISO',
    key: 'sports',
    description:
      'Action photographers often struggle with low available light and fast motion in the scene. When shooting sports or action events, the photographer’s primary objective is to freeze motion, giving priority to short exposure times. To compensate for the lack of exposure, photographers have to increase the ISO setting, which results in a decreased signal-to-noise ratio (SNR).'
  }
];

const xOptions = [
  {
    name: 'Price',
    key: 'price'
  },
  {
    name: 'Release date',
    key: 'launch_date'
  }
];

class ScoreScatterPlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      brands: [],
      selectedY: yOptions[0],
      selectedX: xOptions[0],
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      releaseDates: []
    };
    this.handleYOptionChange = this.handleYOptionChange.bind(this);
    this.handleXOptionChange = this.handleXOptionChange.bind(this);
  }

  componentWillMount() {
    const brands = [];
    const releaseDates = [];
    camerasData.forEach(item => {
      if (item.launch_date) {
        releaseDates.push(new Date(item.launch_date));
      }
      if (!brands.includes(item.brand)) {
        brands.push(item.brand);
      }
    });
    releaseDates.sort((a, b) => a.getTime() - b.getTime());
    this.setState(
      {
        brands,
        releaseDates
      },
      () => this.prepareData()
    );
  }

  prepareData() {
    const { selectedX, selectedY, releaseDates } = this.state;
    const yOptionKey = selectedY.key;
    const xOptionKey = selectedX.key;
    const transformedData = camerasData.map(item => {
      return {
        ...item,
        y: item.scores ? item.scores[yOptionKey] : 0,
        x:
          xOptionKey === 'launch_date'
            ? item[xOptionKey] ? new Date(item[xOptionKey]) : null
            : item[xOptionKey]
      };
    });

    const maxY = Math.max.apply(
      Math,
      camerasData.map(item => (item.scores ? item.scores[yOptionKey] : 0))
    );

    let maxX, minX;

    if (xOptionKey === 'launch_date') {
      // date:
      minX = releaseDates[0];
      maxX = releaseDates[releaseDates.length - 1];
    } else {
      maxX = Math.max.apply(Math, camerasData.map(item => item[xOptionKey]));
      minX = Math.min.apply(Math, camerasData.map(item => item[xOptionKey]));
    }

    this.setState({
      data: transformedData,
      maxX,
      minX,
      maxY
    });
  }

  handleYOptionChange(event) {
    const yOptionIndex = event.target.value;
    this.setState(
      {
        selectedY: yOptions[yOptionIndex]
      },
      () => this.prepareData()
    );
  }

  handleXOptionChange(event) {
    const xOptionIndex = event.target.value;
    this.setState(
      {
        selectedX: xOptions[xOptionIndex]
      },
      () => this.prepareData()
    );
  }

  getAnnotations(brand) {
    return [
      <span
        key="0"
        className="chart-title"
        style={{ position: 'absolute', left: -5, top: 10, width: 200 }}
      >
        {brand}
      </span>,
      <span
        key="1"
        className="axis-label"
        style={{ position: 'absolute', left: 320, top: 300 }}
      >
        {this.state.selectedX.name}
      </span>,
      <span
        key="2"
        className="axis-label"
        style={{
          position: 'absolute',
          left: -100,
          top: 134,
          width: 200,
          MsTransform: 'rotate(90deg)',
          WebkitTransform: 'rotate(90deg)',
          transform: 'rotate(90deg)'
        }}
      >
        {this.state.selectedY.name}
      </span>
    ];
  }

  renderPlotByBrand(brand, i, cValue, color) {
    // setup fill color

    const { data, minX, maxX, minY, maxY, selectedX } = this.state;

    var annotations = this.getAnnotations(brand, i);

    return data.length > 0 ? (
      <div key={i} className="plot" style={{ position: 'relative' }}>
        <Scatterplot
          width={width}
          height={height}
          marginTop={40}
          marginLeft={40}
          x={d => d.x}
          y={d => d.y}
          r={() => 5}
          fill={d => (d.brand === brand ? color(cValue(d)) : '#ddd')}
          xDomain={[minX, maxX]}
          yDomain={[minY, maxY]}
          xTickArguments={[5]}
          yTickArguments={[5]}
          data={data}
          xScale={
            selectedX.key === 'launch_date'
              ? d3.time.scale()
              : d3.scale.linear()
          }
        />

        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          {annotations}
        </div>
      </div>
    ) : (
      <div />
    );
  }

  render() {
    const { brands, selectedX, selectedY } = this.state;
    let cValue = d => d.brand;
    let color = d3.scale.category10();

    let plots = brands.map((brand, i) =>
      this.renderPlotByBrand(brand, i, cValue, color)
    );

    return (
      <div>
        <div style={{ width: '360px', paddingBottom: '20px' }}>
          <div>
            <label>Select Score type</label>
            <select
              className="form-control"
              onChange={this.handleYOptionChange}
            >
              {yOptions.map((yOption, i) => (
                <option key={i} value={i}>
                  {yOption.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Select Price / Release date</label>
            <select
              className="form-control"
              onChange={this.handleXOptionChange}
            >
              {xOptions.map((xOption, i) => (
                <option key={i} value={i}>
                  {xOption.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="plots">
          <div
            className="plot plot-title"
            style={{ width: width - 50, marginRight: 50 }}
          >
            <h3>
              {selectedY.name} vs. {selectedX.name}
            </h3>
            <p>{selectedY.description}</p>
          </div>
          {plots}
        </div>
      </div>
    );
  }
}

export default ScoreScatterPlot;
