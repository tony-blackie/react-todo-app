import React, { /*PropTypes*/ } from 'react'
// import { bindActionCreators } from 'redux'
import { combineReducers } from 'redux'
import { createStore } from 'redux'
import ReactDOM from 'react-dom'

import { connect } from 'react-redux'
import Header from '../components/Header'
import Form from '../components/Form'
// import * as TodoActions from '../actions'

const App = (/*{}*/) => (
  // <div>
  //   <Header />
  //   <Form />
  // </div>
    <TodoApp />
);

const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }
            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));
        default:
            return state;
    }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

//const { combineReducers } = Redux;
const todoApp = combineReducers({todos, visibilityFilter});

//const { createStore } = Redux;
const store = createStore(todoApp);

const { Component } = React;

let nextTodoId = 0;

class TodoApp extends Component {
    render() {
        return (
            <div>
                <button onClick={() => {
                    store.dispatch({
                        type: 'ADD_TODO',
                        text: 'Test',
                        id: nextTodoId++

                })
                }}>
                    Add Todo
                </button>
                <ul>
                    {this.props.todos.map(todo =>
                        <li key={todo.id}>
                            {todo.text}
                        </li>
                    )}
                </ul>

            </div>
        );
    }
}

const render = () => {
    ReactDOM.render(
        <TodoApp
            todos={store.getState().todos}
        />,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();

// App.propTypes = {}

// const mapStateToProps = state => ({})

// const mapDispatchToProps = dispatch => ({})

export default connect(
  // mapStateToProps,
  // mapDispatchToProps
)(App)