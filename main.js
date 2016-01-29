import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
import CycleHTTPDriver from '@cycle/http';

const { button, h1, h4, a, div, makeDOMDriver } = CycleDOM;
const { makeHTTPDriver } = CycleHTTPDriver

// button clicked (DOM read)
// request sent (HTTP write)
// response received (HTTP read)
// data display (DOM write)


function main(sources) {
  const clickEv$ = sources.DOM
    .select('.get-first').events('click');

  const request$ = clickEv$.map(() => {
    return {
      url: 'http://jsonplaceholder.typicode.com/users/1',
      method: 'GET',
    };
  });

  const response$$ = sources.HTTP
    .filter(response$ =>response$.request.url ===
            'http://jsonplaceholder.typicode.com/users/1');
  const response$ = response$$.switch();
  const firstUser$ = response$.map(response => response.body)
    .startWith(null);

  return {
    DOM: firstUser$.map(firstUser =>
      div([
        button('.get-first', 'Get first user'),
        firstUser === null ? null : div('.user-details', [
          h1('.user-name', firstUser.name),
          h4('.user-email', firstUser.email),
          a('.user-website', {href: firstUser.website}, firstUser.website)
        ])
      ])
    ),
    HTTP: request$,
  }
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
}

Cycle.run(main, drivers);
