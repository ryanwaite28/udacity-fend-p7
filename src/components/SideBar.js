import React, { Component } from 'react';

class SideBar extends Component {
  render() {
    let displaySidebar = this.props.sidebarOpen ? "block" : "none";
    let self = this;
    return (
      <div id="sidebar" style={{ display: displaySidebar }}>
        <ul id="places-list">
          {
            this.props.places && Object.keys(self.props.places).map(function(key){
              let place = self.props.places[key];
              return (
                <li className="transition" title={ place.name } key={ place.id } onClick={() => { self.props.liPlaceClick(place) }}>
                  <h4><strong>{ place.name }</strong></h4>
                  <p>
                    { place.location.address }<br/>
                    { place.location.crossStreet && place.location.crossStreet }<br/>
                    { place.location.city }, { place.location.state } { place.location.postalCode && place.location.postalCode }<br/>
                    { place.location.country }<br/>
                  </p>
                  <p>{ place.hereNow.count } | { place.hereNow.summary }</p>
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}

export default SideBar;
