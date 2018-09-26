import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import * as utils from './utils'

function sort_by(array, property, direction) {
let tempArray = array;
tempArray.sort(function(a, b){
  var x = a[property].constructor === String && a[property].toLowerCase() || a[property];
  var y = b[property].constructor === String && b[property].toLowerCase() || b[property];
  let value = direction && String(direction) || "asc";
  switch(value) {
    case "asc":
      // asc
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    case "desc":
      // desc
      if (x > y) {return -1;}
      if (x < y) {return 1;}
      return 0;
    default:
      // asc
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
  }
});
return tempArray;
}



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: null,
      sidebarOpen: false,
      query: ""
    }
    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.loadPlaces = this.loadPlaces.bind(this);
    this.menuKeyEnter = this.menuKeyEnter.bind(this);
  }

  toggleSideBar() {
    this.setState(state => ({ sidebarOpen: !state.sidebarOpen }));
  }

  loadPlaces() {
    return new Promise(function(resolve, reject){
      utils.getVenues()
      .then(venues => {
        if(venues.length > 0) {
          console.log('returning venues from idb');
          return resolve(venues) ;
        }
        console.log('fetching venues...');
        let city = 'Silver Spring, MD';
        let query = 'Shopping';
        var apiURL = 'https://api.foursquare.com/v2/venues/search?client_id=N1IAMKZUIK1AUHKRFGFBKPQ2YKDSBAKS4NTER5SYZN5CROR1&client_secret=4MKLXVLU2FGZQVRMAEDC15P0TFJGSCY3ZUYUZ0KHQQQLQ5R3&v=20130815%20&limit=33&near=' + city + '&query=' + query + '';
        fetch(apiURL)
        .then(resp => resp.json())
        .then(json => {
          let { venues } = json.response;
          console.log('storing venues...');
          utils.storeVenues(venues)
          .then(res => {
            console.log('stored venues');
            return resolve(venues);
          })
        })
        .catch(error => {
          reject(error);
        })
      })
      .catch(error => {
        reject(error);
      })
    });
  }

  loadWiki() {
    return new Promise(function(resolve, reject){
      utils.getAJAXfetches("moco-wiki")
      .then(result => {
        if(result) {
          console.log('returning moco-wiki from idb');
          return resolve(result) ;
        }
        console.log('fetching moco-wiki...');
        var apiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=montgomery%20county%20maryland&format=json&callback=?';
        fetch(apiURL, {mode: 'cors'})
        .then(resp => resp.json())
        .then(json => {
          console.log('storing moco-wiki...');
          utils.storeAJAXfetch("moco-wiki", json)
          .then(res => {
            console.log('stored moco-wiki');
            return resolve(json);
          })
        })
        .catch(error => {
          reject(error);
        })
      })
      .catch(error => {
        reject(error);
      })
    });
  }

  getGoogleMaps() {
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise((resolve) => {
        window.resolveGoogleMapsPromise = () => {
          resolve(window.google);
          delete window.resolveGoogleMapsPromise;
        };
        const script = document.createElement("script");
        const API = 'AIzaSyB6N63ZIGH4b8Hgm9KhodA87Guuiem3C8Y';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
      });
    }
    return this.googleMapsPromise;
  }

  componentWillMount() {
    this.getGoogleMaps();
  }

  aft = (l) => {
    let s = "";
    let i = 0;
    let e = l.length - 1;
    for(i = 0; i < e; i++) {
      s += (l[i] + "<br/>")
    }
    s += l[i];
    return s;
  }

  li_click(venue) {
    let marker = this.markers.filter(m => m.venue.id === venue.id)[0];
    let info_obj = this.info_boxes.filter(i => i.id === venue.id)[0];
    let infoBox = info_obj && info_obj.contents || "nothing...";
    if(marker && infoBox) {
      this.infowindow.setContent(infoBox);
      this.map.setZoom(13);
      this.map.setCenter(marker.position);
      this.infowindow.open(this.map, marker);
      this.map.panBy(0, -125);
      if(window.innerWidth < 769) {
        this.toggleSideBar();
      }
    }
  }

  getGoogleImage(venue) {
    return 'https://maps.googleapis.com/maps/api/streetview?size=150x150&location=' + venue.location.lat + ',' + venue.location.lng + '&heading=151.78&pitch=-0.76&key=AIzaSyB6N63ZIGH4b8Hgm9KhodA87Guuiem3C8Y'
  }

  componentDidMount() {
    let get_google = this.getGoogleMaps();
    let get_venues = this.loadPlaces();
    // let get_wiki = this.loadWiki(); // not working

    Promise.all([ get_google, get_venues ])
    .then(values => {
      console.log(values);
      let google = values[0];
      let venues = values[1];
      let markers = [];
      let info_boxes = [];

      this.infowindow = new google.maps.InfoWindow();
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        scrollwheel: true,
        center: { lat: venues[0].location.lat, lng: venues[0].location.lng }
      });

      /* --- */

      venues.forEach(venue => {
        let marker = new google.maps.Marker({
          position: { lat: venue.location.lat, lng: venue.location.lng },
          map: this.map,
          venue: venue,
          id: venue.id,
          name: venue.name,
          animation: google.maps.Animation.DROP
        });
        let infoBox = '<div class="info_box">' +
        '<h4>' + venue.name + '</h4>' +
        '<p>' + this.aft(venue.location.formattedAddress) + '</p>' +
        '<p>' + venue.hereNow.summary + '</p>' +
        '<img class="middlr" alt="' + venue.name + '" src="' + this.getGoogleImage(venue) + '" />' +
        '</div>';
        marker.addListener('click', () => {
          if (marker.getAnimation() !== null) { marker.setAnimation(null); }
				  else { marker.setAnimation(google.maps.Animation.BOUNCE); }
				  setTimeout(() => { marker.setAnimation(null) }, 1500);
			  });
        google.maps.event.addListener(marker, 'click', () => {
  			   this.infowindow.setContent(infoBox);
				   this.map.setZoom(13);
				   this.map.setCenter(marker.position);
				   this.infowindow.open(this.map, marker);
				   this.map.panBy(0, -125);
			  });
        markers.push(marker);
        info_boxes.push({ id: venue.id, name: venue.name, contents: infoBox });
      });

      this.venues = sort_by(venues, "name", "asc");
      this.markers = sort_by(markers, "name", "asc");
      this.info_boxes = sort_by(info_boxes, "name", "asc");

      this.setState({ sidebarOpen: true, filtered: this.venues });
    })
    .catch(error => {
      console.log(error);
      alert('Error loading page...');
    })
  }

  filterVenues(query) {
    let f = query ? this.venues.filter(v => v.name.toLowerCase().includes(query)) : this.venues;
    this.markers.forEach(m => {
      m.name.toLowerCase().includes(query) ?
      m.setVisible(true) :
      m.setVisible(false);
    });
    this.setState({ filtered: f, query: query });
  }

  menuKeyEnter(event) {
    var code = event.keyCode || event.which;
    if(code === 13) {
      this.toggleSideBar();
    }
  }

  render() {
    let displaySidebar = this.state.sidebarOpen ? "block" : "none";
    let menuText = this.state.sidebarOpen ? "Close" : "Open";

    return (
      <div id="app-container">
        {/* Nav Bar */}
        <nav id="navbar" role="navigation">
          <h3 id="head-text">Neighborhood Maps</h3>
          <h3 tabIndex="0" id="menu-text" className="transition" title={ menuText + " Sidebar" }
            onClick={() => { this.toggleSideBar() }} onKeyPress={this.menuKeyEnter}>
            {
              this.state.sidebarOpen ?
              <i className="material-icons" style={{lineHeight: "inherit"}}>clear</i> :
              <i className="material-icons" style={{lineHeight: "inherit"}}>menu</i>
            }
          </h3>
        </nav>

        {/* Side Bar */}
        <section id="sidebar" style={{ display: displaySidebar }}>
          <div id="sidebar-inner">
            <input className="transition middlr input-s1" placeholder="Filter Venues"
              value={this.state.query} onChange={(e) => { this.filterVenues(e.target.value) }} />
            <ul id="places-list">
              {
                this.state.filtered && this.state.filtered.map((venue, key) => (
                  <li className="transition" key={ venue.id } onClick={() => { this.li_click(venue) }}>
                    <h4><strong><a title={ venue.name } href={"https://www.google.com/search?q=" + venue.name}>{ venue.name }</a></strong></h4>
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
                    <img className="polaroid" src={this.getGoogleImage(venue)} alt={ venue.name } />
                  </li>
                ))
              }
            </ul>
          </div>
        </section>

        {/* Map Div */}
        <main>
          <div role="application" aria-hidden="true" id="map"></div>
        </main>
      </div>
    );
  }
}

export default App;
