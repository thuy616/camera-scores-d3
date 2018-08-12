import React, { Component } from 'react';
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
    key: 'sport',
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
      maxY: 0
    };
  }

  prepareData() {
    const yOptionKey = this.state.selectedY.key;
    const xOptionKey = this.state.selectedX.key;
    const transformedData = camerasData.map(item => {
      return {
        ...item,
        y: item.scores ? item.scores[yOptionKey] : 0,
        x: item[xOptionKey]
      };
    });

    const maxY = Math.max.apply(
      Math,
      camerasData.map(item => (item.scores ? item.scores[yOptionKey] : 0))
    );

    const maxX = Math.max.apply(
      Math,
      camerasData.map(item => item[xOptionKey])
    );
    const minX = Math.min.apply(
      Math,
      camerasData.map(item => item[xOptionKey])
    );

    this.setState({
      data: transformedData,
      maxX,
      minX,
      maxY
    });
  }

  componentWillMount() {
    const brands = [];
    camerasData.forEach(item => {
      if (!brands.includes(item.brand)) {
        brands.push(item.brand);
      }
    });
    this.setState({
      brands
    });
    this.prepareData();
  }

  // handleYOptionChange(newYOption) {}

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

    const { data, minX, maxX, minY, maxY } = this.state;

    var annotations = this.getAnnotations(brand, i);

    return data.length > 0 ? (
      <div key={i} className="plot" style={{ position: 'relative' }}>
        <Scatterplot
          width={width}
          height={height}
          marginTop={40}
          x={d => d.x}
          y={d => d.y}
          r={() => 5}
          fill={d => (d.brand === brand ? color(cValue(d)) : '#ddd')}
          xDomain={[minX, maxX]}
          yDomain={[minY, maxY]}
          xTickArguments={[5]}
          yTickArguments={[5]}
          data={data}
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
    // this.prepareData();
    const { brands, selectedX, selectedY } = this.state;
    let cValue = d => d.brand;
    let color = d3.scale.category10();

    let plots = brands.map((brand, i) =>
      this.renderPlotByBrand(brand, i, cValue, color)
    );

    return (
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
    );
  }
}

export default ScoreScatterPlot;
