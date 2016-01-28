import Rx from 'rx';
import Cycle from '@cycle/core';

function h(tagName, children) {
  return {
    tagName,
    children
  };
}

// Logic (functional)
function main(sources) {
  const mouseover$ = sources.DOM.selectEvents('span', 'mouseover');
  const sinks = {
    DOM: mouseover$
      .startWith(null)
      .flatMapLatest(() =>
        Rx.Observable.timer(0, 1000)
        .map(i => {
          return h('H1', [
            h('SPAN', [ `Seconds elapsed: ${i}` ],)
          ]);
        }),
      ),
    Log: Rx.Observable.timer(0, 2000).map(i => 2*i),
  };
  return sinks;
}

// source: input (read) effects
// since: output (write) effects

// Drivers (aka effects, imperative)
// OS drivers = interface between software and hardware
// Here, hardware = effects, drivers = interfaces between logic and effects
function DOMDriver(obj$) {
  function createElement(obj) {
    const element = document.createElement(obj.tagName);
    obj.children
      .filter(c => typeof c === 'object')
      .map(createElement)
      .forEach(c => element.appendChild(c));
    obj.children
      .filter(c => typeof c === 'string')
      .forEach(c => element.innerHTML += c);
    return element;
  }

  obj$.subscribe(obj => {
    const container = document.querySelector('#app');
    container.innerHTML = '';
    const element = createElement(obj);
    container.appendChild(element);
  });
  // DOMSource ...
  const DOMSource = {
    selectEvents: function(tagName, eventType) {
      return Rx.Observable.fromEvent(document, eventType)
        .filter(ev => ev.target.tagName === tagName.toUpperCase());
    }
  }
  return DOMSource;
}

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
  DOM: DOMDriver,
  Log: consoleLogDriver,
}

Cycle.run(main, drivers);
