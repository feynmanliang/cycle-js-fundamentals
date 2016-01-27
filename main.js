import Rx from 'rxjs';

// Logic (functional)
Rx.Observable.timer(0, 1000)
  .map(i => `Seconds elapsed ${i}`)
// Effects (imperative)
  .subscribe(text => {
    const container = document.querySelector('#app');
    container.textContent = text;
  })
