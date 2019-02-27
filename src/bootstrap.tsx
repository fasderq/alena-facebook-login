import { h, render } from 'preact';
import { App } from './app/app';

import './app/styles/app.scss';

render(<App title='Alena' />, document.getElementById('app'));