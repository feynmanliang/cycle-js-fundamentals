import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';

const { h, h1, span, makeDOMDriver } = CycleDOM;

// Logic (functional)
function main(sources) {
  const mouseover$ = sources.DOM.select('span').events('mouseover');
  const sinks = {
    DOM: mouseover$
      .startWith(null)
      .flatMapLatest(() =>
          Rx.Observable.timer(0, 1000)
            .map(i =>
               h1([
                 span([
                   `Seconds elapsed: ${i}`
                 ])
               ]))),
    Log: Rx.Observable.timer(0, 2000).map(i => 2*i),
  };
  return sinks;
}

// source: input (read) effects
// since: output (write) effects

// Drivers (aka effects, imperative)
// OS drivers = interface between software and hardware
// Here, hardware = effects, drivers = interfaces between logic and effects
function consoleLogDriver(msg$) {
  msg$.subscribe(msg => console.log(msg));
}

// Wiring (different) sinks to (different) effects
function run(mainFn, drivers) {
  const proxySources = {};
  Object.keys(drivers).forEach(key => {
    proxySources[key] = new Rx.Subject();
  });
  const sinks = mainFn(proxySources);
  Object.keys(drivers).forEach(key => {
    const source = drivers[key](sinks[key]);
    source.subscribe(x => proxySources[key].onNext(x))
  })
}

// Effects keys must match sink keys
const drivers = {
  DOM: makeDOMDriver('#app'),
  Log: consoleLogDriver,
}

Cycle.run(main, drivers);
