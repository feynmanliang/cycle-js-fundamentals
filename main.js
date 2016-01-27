import Rx from 'rxjs';

// Logic (functional)
function main() {
  return {
    DOM: Rx.Observable.timer(0, 1000)
      .map(i => `Seconds elapsed ${i}`),
    Log: Rx.Observable.timer(0, 2000).map(i => 2*i),
  };
}

// Drivers (aka effects, imperative)
// OS drivers = interface between software and hardware
// Here, hardware = effects, drivers = interfaces between logic and effects
function DOMDriver(text$) {
  text$.subscribe(text => {
    const container = document.querySelector('#app');
    container.textContent = text;
  });
}

function consoleLogDriver(msg$) {
  msg$.subscribe(msg => console.log(msg));
}

// Wiring (different) sinks to (different) effects
function run(mainFn, effects) {
  const sinks = mainFn();
  Object.keys(effects).forEach(key => {
    effects[key](sinks[key]);
  })
}

// Effects keys must match sink keys
const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver,
}
run(main, drivers);
