import React, { Component } from 'react';

class NavBar extends Component {
  render() {
    return (
      <nav id="navbar">
        <h3 id="head-text">Neighborhood Maps</h3>
        <h3 tabIndex="0" className="transition menu-text" title={ this.props.menuText + " Sidebar" }
          onClick={() => { this.props.toggleSideBar() }} onKeyPress={this.props.menuKeyEnter}>
          {
            this.props.sidebarOpen ?
            <i className="material-icons" style={{lineHeight: "inherit"}}>clear</i> :
            <i className="material-icons" style={{lineHeight: "inherit"}}>menu</i>
          }
        </h3>
      </nav>
    );
  }
}

export default NavBar;
