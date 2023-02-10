import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { reducer, StateProvider } from "./state";
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(
  <StateProvider reducer={reducer}>
    <App />
  </StateProvider>,
  document.getElementById('root')
);
