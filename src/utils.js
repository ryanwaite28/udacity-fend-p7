import idb from 'idb';



export const dbPromise = idb.open('restaurants-app-db', 1, upgradeDB => {
  var ajax_fetches_store = upgradeDB.createObjectStore('ajax_fetches');
  var venues_store = upgradeDB.createObjectStore('venues', { keyPath: 'id' });
  venues_store.createIndex('id', 'id');
});

export function getAJAXfetches(key) {
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
  return dbPromise.then(db => {
    const tx = db.transaction('ajax_fetches', 'readwrite');
    let store = tx.objectStore('ajax_fetches');
    store.put(value, key)
    return tx.complete;
  });
}

export function storeVenues(venues) {
  return dbPromise.then(db => {
    const tx = db.transaction('venues', 'readwrite');
    let store = tx.objectStore('venues');
    venues.forEach(venue => { store.put(venue) });
    return tx.complete;
  });
}
