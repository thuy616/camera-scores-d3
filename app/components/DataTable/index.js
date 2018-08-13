import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';

import 'react-table/react-table.css';

class CameraDataTable extends Component {
  renderScore(row, highThreshold, lowThreshold, maxValue) {
    const width = Math.round(row.value * 100 / maxValue);
    return row.value > 0 ? (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#dadada',
          borderRadius: '2px'
        }}
      >
        <div
          style={{
            width: `${width - 1}%`,
            height: '100%',
            backgroundColor:
              row.value > highThreshold
                ? '#badc58'
                : row.value > lowThreshold ? '#f6e58d' : '#ffbe76',
            borderRadius: '2px',
            transition: 'all .2s ease-out'
          }}
        >
          {row.value}
        </div>
      </div>
    ) : (
      '-'
    );
  }

  getMaxScore(scoreType) {
    const { data } = this.props;
    return Math.max.apply(
      Math,
      data.map(item => (item.scores ? item.scores[scoreType] : 0))
    );
  }

  render() {
    const { data, itemsPerPage } = this.props;
    const columns = [
      {
        Header: 'Look',
        id: 'look',
        accessor: d => d.image,
        Cell: row => {
          return (
            <div
              style={{
                width: '100%',
                height: '100%'
              }}
            >
              <img src={row.value} height="30" width="auto" />
            </div>
          );
        }
      },
      {
        Header: 'Brand',
        id: 'brand',
        accessor: d => d.brand
      },
      {
        Header: 'Name',
        id: 'name',
        accessor: d => d.name
      },
      {
        Header: 'Resolution',
        id: 'resolution',
        accessor: d => d.specs.find(spec => spec.key === 'Pixels').value
      },
      {
        Header: 'Overall Score',
        id: 'overall',
        accessor: d => (d.scores ? d.scores.overall : 0),
        Cell: row => this.renderScore(row, 80, 70, this.getMaxScore('overall'))
      },
      {
        Header: 'Portrait (bits)',
        id: 'portrait',
        accessor: d => (d.scores ? d.scores.portrait : 0),
        Cell: row => this.renderScore(row, 24, 22, this.getMaxScore('portrait'))
      },
      {
        Header: 'Landscapre (Evs)',
        id: 'landscape',
        accessor: d => (d.scores ? d.scores.landscape : 0),
        Cell: row =>
          this.renderScore(row, 13, 10, this.getMaxScore('landscape'))
      },
      {
        Header: 'Sports (iso)',
        id: 'sports',
        accessor: d => (d.scores ? d.scores.sports : 0),
        Cell: row =>
          this.renderScore(row, 2500, 1500, this.getMaxScore('sports'))
      },
      {
        Header: 'Price',
        id: 'price',
        accessor: d => d.price,
        Cell: row => '$' + row.value
      },
      {
        Header: 'Release date',
        id: 'release_date',
        accessor: d => d.launch_date
      },
      {
        Header: 'Sensor type',
        id: 'sensor',
        accessor: d =>
          d.specs.find(spec => spec.key === 'Sensor Type / Size').value
      }
    ];

    return (
      <div>
        <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={itemsPerPage}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

CameraDataTable.propTypes = {
  data: PropTypes.array,
  itemsPerPage: PropTypes.number.required
};

export default CameraDataTable;
