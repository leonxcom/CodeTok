import React from 'react';

const VueVsReact = () => {
  return (
    <div>
      <h1>Vue 3 vs React: Key Differences</h1>
      <ul>
        <li>
          <strong>Template Syntax:</strong> Vue uses HTML-based templates, while React uses JSX.
        </li>
        <li>
          <strong>State Management:</strong> Vue has built-in state management with the Composition API, while React relies on external libraries like Redux or Context API.
        </li>
        <li>
          <strong>Reactivity:</strong> Vue's reactivity system is built-in and automatic, whereas React requires manual state updates with `useState` or `useReducer`.
        </li>
        <li>
          <strong>Component Structure:</strong> Vue components are more opinionated with a clear separation of concerns, while React components are more flexible and JavaScript-centric.
        </li>
        <li>
          <strong>Learning Curve:</strong> Vue is often considered easier to learn for beginners due to its simplicity, while React has a steeper learning curve due to its ecosystem and concepts like hooks.
        </li>
      </ul>
    </div>
  );
};

export default VueVsReact;