import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducers";
import initialState from "./initialState";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(sagaMiddleware),
);
sagaMiddleware.run(rootSaga);

export default store;
