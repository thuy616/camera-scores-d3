import React, { Component } from 'react';
import camerasData from '../../data/camerasData.json';
import CameraDataTable from '../../components/DataTable';

export default class CameraDataTableContainer extends Component {
  render() {
    return (
      <div>
        <h3>Mirrorless Cameras</h3>
        <div>
          <CameraDataTable data={camerasData} itemsPerPage={20} />
        </div>
      </div>
    );
  }
}
