import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware, combineEpics, ofType } from "redux-observable";
import { createAction } from "redux-actions";
import Ticker from "./components/Ticker";
import RootReducer from "./reducers";
import { webSocket } from "rxjs/webSocket";
import { timer, fromEvent } from "rxjs";
import {
  takeUntil,
  mergeMap,
  map,
  distinctUntilKeyChanged
} from "rxjs/operators";

const SOCKET_URL = "wss://api.delta.exchange:2096";
const wsSubject = webSocket(SOCKET_URL);

const ticker = action =>
  wsSubject.multiplex(
    () => {
      return {
        type: "subscribe",
        payload: {
          channels: [
            {
              name: "ticker",
              symbols: [action.payload]
            }
          ]
        }
      };
    },
    () => ({
      type: "unsubscribe",
      payload: {
        channels: [
          {
            name: "ticker",
            symbols: [action.payload]
          }
        ]
      }
    }),
    message => {
      return message.type === "ticker";
    }
  );

const subscribeTicker = createAction("SUBSCRIBE");
const tick = createAction("TICK");

const subEpic = action$ =>
  action$.pipe(
    ofType("SUBSCRIBE"),
    mergeMap(action =>
      ticker(action).pipe(takeUntil(action$.ofType("SUBSCRIBE")))
    ),
    map(tick)
  );

const epicsArr = [subEpic];
const epics = combineEpics(...epicsArr);
const epicMiddleware = createEpicMiddleware();

const store = createStore(RootReducer, applyMiddleware(epicMiddleware));
epicMiddleware.run(epics);

const rootEl = document.getElementById("root");

const render = () => {
  ReactDOM.render(
    <Ticker
      value={store.getState()}
      onIncrement={() => store.dispatch(subscribeTicker("BTCUSD"))}
      onDecrement={() => store.dispatch(subscribeTicker("BTCUSD_27Dec"))}
    />,
    rootEl
  );
};
render();
store.subscribe(render);
