import Rx from 'rxjs';

// Logic
Rx.Observable.timer(0, 1000)
  .map(i => `Seconds elapsed ${i}`)
// Effects
  .subscribe(text => {
    const container = document.querySelector('#app');
    container.textContent = text;
  })
