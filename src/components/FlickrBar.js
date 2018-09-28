import React, { Component } from 'react';

import * as utils from '../utils'



class FlickrBar extends Component {
  state = {
    photos_list: []
  }

  componentWillMount() {
    utils.getFlickrPhotos('garden').then(photos_list => {
      this.setState({ photos_list });
    });
  }

  render() {
    let displaySidebar = this.props.sidebarOpen ? "block" : "none";
    let { classes } = this.props;
    return (
      <section id="sidebar-right" style={{ display: displaySidebar }}>


      </section>
    );
  }
}

export default FlickrBar;
