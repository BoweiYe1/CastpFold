import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import {middleware as fetchMiddleware} from 'react-redux-fetch'


import thunk from 'redux-thunk';
import rootReducer from '../reducers'

const initialState = {} 

export const history = createBrowserHistory()

export const store = createStore(
    connectRouter(history)(rootReducer), // new root reducer with router state
    initialState,
    compose(
        applyMiddleware(
            routerMiddleware(history), // for dispatching history actions
            thunk,// ... other middlewares ...
        ),
        applyMiddleware(fetchMiddleware)
    ),
)