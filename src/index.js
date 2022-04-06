import React from 'react';
import ReactDOM from 'react-dom';
import './main/index.css';
import { BrowserRouter } from 'react-router-dom';
import LoginLayout  from './main/Route';


ReactDOM.render(
  <BrowserRouter>
     <LoginLayout />
  </BrowserRouter>,
  document.getElementById('root')
);


