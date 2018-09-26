import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import startServiceWorker from './startServiceWorker';



ReactDOM.render(<App />, document.getElementById('root'));
startServiceWorker();
