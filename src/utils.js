import idb from 'idb';



export const dbPromise = idb.open('restaurants-app-db', 1, upgradeDB => {
  upgradeDB.createObjectStore('ajax_fetches');
  var venues_store = upgradeDB.createObjectStore('venues', { keyPath: 'id' });
  venues_store.createIndex('id', 'id');
});

export function getAJAXfetches(key) {
  if(!key) {
    console.log(key);
    return Promise.reject('"key" argument is required');
  }
  if(key.constructor !== String) {
    console.log(key);
    return Promise.reject('"key" must be a string');
  }
  return dbPromise.then(db => {
    return db.transaction('ajax_fetches').objectStore('ajax_fetches').get(key);
  })
}

export function getVenues() {
  return dbPromise.then(db => {
    return db.transaction('venues').objectStore('venues').getAll();
  })
}

export function storeAJAXfetch(key, value) {
  if(!key) {
    console.log(key);
    return Promise.reject('"key" argument is required');
  }
  if(key.constructor !== String) {
    console.log(key);
    return Promise.reject('"key" must be a string');
  }
  if(!value) {
    console.log(value);
    return Promise.reject('"value" argument is required');
  }
  return dbPromise.then(db => {
    const tx = db.transaction('ajax_fetches', 'readwrite');
    let store = tx.objectStore('ajax_fetches');
    store.put(value, key);
    return tx.complete;
  });
}

export function storeVenues(venues) {
  if(!venues || !Array.isArray(venues)) {
    console.log(venues);
    return Promise.reject('"venues" argument must be an array');
  }
  if(venues.length === 0) {
    console.log(venues);
    return Promise.reject('"venues" array length must be greater than 1');
  }
  for(let v of venues) {
    if(v.constructor !== Object) {
      console.log(v);
      return Promise.reject('each item in "venues" must be an object literal');
    }
    if(!v.id) {
      console.log(v);
      return Promise.reject('each item in "venues" must have "id" property');
    }
  }
  return dbPromise.then(db => {
    const tx = db.transaction('venues', 'readwrite');
    let store = tx.objectStore('venues');
    venues.forEach(venue => { store.put(venue) });
    return tx.complete;
  });
}

/* --- */

export function sort_by(array, property, direction) {
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

export function aft(l) {
  let s = "";
  let i = 0;
  let e = l.length - 1;
  for(i = 0; i < e; i++) {
    s += (l[i] + "<br/>")
  }
  s += l[i];
  return s;
}

/* --- */

export function getGoogleMaps() {
  return new Promise((resolve) => {
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

export function loadPlaces() {
  return new Promise(function(resolve, reject){
    getVenues()
    .then(venues => {
      if(venues.length > 0) {
        console.log('returning venues from idb');
        return resolve(venues) ;
      }
      console.log('fetching venues...');
      let city = 'Silver Spring, MD';
      let query = 'Shopping';
      var apiURL = 'https://api.foursquare.com/v2/venues/search?client_id=N1IAMKZUIK1AUHKRFGFBKPQ2YKDSBAKS4NTER5SYZN5CROR1&client_secret=4MKLXVLU2FGZQVRMAEDC15P0TFJGSCY3ZUYUZ0KHQQQLQ5R3&v=20130815%20&limit=50&near=' + city + '&query=' + query + '';
      fetch(apiURL)
      .then(resp => resp.json())
      .then(json => {
        let { venues } = json.response;
        console.log('storing venues...');
        storeVenues(venues)
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

export function loadWiki() {
  return new Promise(function(resolve, reject){
    getAJAXfetches("moco-wiki")
    .then(result => {
      if(result) {
        console.log('returning moco-wiki from idb');
        return resolve(result) ;
      }
      console.log('fetching moco-wiki...');
      window.$.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search=montgomery%20county%20maryland&format=json&callback=wikicallback',
        dataType: 'jsonp',
        success: function(resp) {
          console.log('storing moco-wiki...');
          storeAJAXfetch("moco-wiki", resp)
          .then(res => {
            console.log('stored moco-wiki');
            return resolve(resp);
          })
        },
        error: function(e) {
          console.log(e);
          reject(e);
        }
      })
    })
    .catch(error => {
      reject(error);
    })
  });
}

export function getGoogleImage(venue) {
  return 'https://maps.googleapis.com/maps/api/streetview?size=150x150&location=' + venue.location.lat + ',' + venue.location.lng + '&heading=151.78&pitch=-0.76&key=AIzaSyB6N63ZIGH4b8Hgm9KhodA87Guuiem3C8Y'
}

export function getFlickrPhotos(query = "DMV") {
  return new Promise(function(resolve, reject){
    getAJAXfetches("flickr-pictures")
    .then(result => {
      if(result) {
        console.log('returning flickr-pictures from idb');
        return resolve(result) ;
      }

      window.jsonFlickrApi = function(json){
        let photos_list = [];

        for(let photo of json.photos.photo) {
          var farm = photo.farm;
          var id = photo.id;
          var secret = photo.secret;
          var server = photo.server;

          var img = 'https://farm' + farm + '.staticflickr.com/' + server +
          '/' + id + '_' + secret + '.jpg';

          let Photo = Object.assign({}, photo, { img: img });

          photos_list.push(Photo);
        }

        console.log('storing flickr-pictures...');
        storeAJAXfetch("flickr-pictures", photos_list)
        .then(res => {
          console.log('stored flickr-pictures');
          resolve(photos_list);
          delete window.jsonFlickrApi;
        })
      }

      var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' +
      '3909720ecbeba83d318a1dd0a7578f03' + '&tags=' + query + '&format=json&callback=?';

      console.log('fetching flickr-pictures...');
      window.$.ajax({
        url: flickrAPI,
        dataType: 'jsonp',
        success: function(resp) {
          console.log(resp);
        }
      });
    })
    .catch(error => {
      reject(error);
    })
  });
}
