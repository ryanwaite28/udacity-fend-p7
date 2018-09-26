import React, { Component } from 'react';

class MapDiv extends Component {
  render() {
    return (
      <main>
        <div role="application" aria-hidden="true" id="map"></div>
      </main>
    );
  }
}

export default MapDiv;
