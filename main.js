import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
import CycleHTTPDriver from '@cycle/http';

const {button, p, label, div, makeDOMDriver } = CycleDOM;
const { makeHTTPDriver } = CycleHTTPDriver

function main(sources) {
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
}

Cycle.run(main, drivers);
