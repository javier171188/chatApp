import * as type from "../types";
import { takeEvery } from "redux-saga/effects";
import { request } from "graphql-request";
import { changeLanguage } from '../../graphql/mutations';

const { USER_PATH } = process.env;


function* setLanguage(data) {
  const token = sessionStorage.getItem("token");
  const { paramsLang } = data.payload;


  yield request(`${USER_PATH}/api`, changeLanguage, { token, paramsLang });
  yield localStorage.setItem("language", paramsLang.chosenLanguage);
}
function* setLanguageSaga() {
  yield takeEvery(type.CHANGE_LANGUAGE, (data) => setLanguage(data));
}

module.exports = {
  setLanguageSaga
}