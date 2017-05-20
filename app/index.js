import React from 'react';
import { render } from 'react-dom';
import AppProvider from './app';

render(
  <AppProvider />,
  document.getElementById('root')
);
