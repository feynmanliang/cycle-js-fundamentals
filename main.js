import Rx from 'rxjs';

// Logic (functional)
function main(DOMSource) {
  const click$ = DOMSource;
  return {
    DOM: click$
      .startWith(null)
      .switchMap(() =>
        Rx.Observable.timer(0, 1000)
        .map(i => `Seconds elapsed ${i}`),
      ),
    Log: Rx.Observable.timer(0, 2000).map(i => 2*i),
  };
}

// source: input (read) effects
// since: output (write) effects

// Drivers (aka effects, imperative)
// OS drivers = interface between software and hardware
// Here, hardware = effects, drivers = interfaces between logic and effects
function DOMDriver(text$) {
  text$.subscribe(text => {
    const container = document.querySelector('#app');
    container.textContent = text;
  });
  // DOMSource ...
  const DOMSource = Rx.Observable.fromEvent(document, 'click');
  return DOMSource;
}

function consoleLogDriver(msg$) {
  msg$.subscribe(msg => console.log(msg));
}

// Wiring (different) sinks to (different) effects
function run(mainFn, drivers) {
  const proxyDOMSource = new Rx.Subject();
  const sinks = mainFn(proxyDOMSource);
  const DOMSource = drivers.DOM(sinks.DOM);
  DOMSource.subscribe(click => proxyDOMSource.next(click));
  //Object.keys(drivers).forEach(key => {
  //  drivers[key](sinks[key]);
  //})
}

// Effects keys must match sink keys
const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver,
}
run(main, drivers);
