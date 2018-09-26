import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import * as utils from '../utils'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  paper: {
    // position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    maxWidth: '95%'
  }
});

class SideBar extends Component {
  linkspanKeyEnter = (event, venue) => {
    var code = event.keyCode || event.which;
    if(code === 13) {
      window.open("https://www.google.com/search?q=" + venue.name + ' ' + venue.location.formattedAddress[venue.location.formattedAddress.length - 2], '_blank');
    }
  }

  render() {
    let displaySidebar = this.props.sidebarOpen ? "block" : "none";
    let { classes } = this.props;
    return (
      <section id="sidebar" style={{ display: displaySidebar }}>
        <div id="sidebar-inner">
          { this.props.wikidata &&
            <p className="text-center">
              <Button variant="contained" color="primary" className={classes.button} onClick={this.props.handleShow}>
                Info
              </Button>
            </p>
          }

          <input className="transition middlr input-s1" placeholder="Filter Venues"
            value={this.props.query} onChange={(e) => { this.props.filterVenues(e.target.value) }} />
          <ul id="places-list">
            {
              this.props.filtered && this.props.filtered.map((venue, key) => (
                <li tabIndex="0" className="transition" title={ venue.name } key={ venue.id } onClick={() => { this.props.li_click(venue) }} onKeyPress={(event) => { this.props.liKeyEnter(event, venue) }}>
                  <h5><strong>
                    <span className="venue-name"
                      onClick={() => { window.open("https://www.google.com/search?q=" + venue.name + ' ' + venue.location.formattedAddress[venue.location.formattedAddress.length - 2], '_blank') }}
                      onKeyPress={(event) => { this.linkspanKeyEnter(event, venue) }}>
                        { venue.name }
                    </span>
                  </strong></h5>
                  <p>
                    {
                      venue.location.formattedAddress.map((value, index) => {
                        return index === (venue.location.formattedAddress.length - 1) ?
                        <span key={index}><span>{value}</span></span> :
                        (<span  key={index}><span>{value}</span><br/></span>)
                      })
                    }
                  </p>
                  <p>{ venue.hereNow.summary }</p>
                  <img className="polaroid" src={utils.getGoogleImage(venue)} alt={ venue.name } />
                </li>
              ))
            }
          </ul>
        </div>
      </section>
    );
  }
}

export default withStyles(styles)(SideBar);
