import { combineReducers } from 'redux';
import chatArea from './chatArea';
import loginLogout from './loginLogout';
import modals from './modals';
import searchArea from './searchArea';
import sideChanges from './sideChanges';
import userState from './userState';


const reducer = combineReducers({
  chatArea,
  loginLogout,
  modals,
  searchArea,
  sideChanges,
  userState,
})

export default reducer;
