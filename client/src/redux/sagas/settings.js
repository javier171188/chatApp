import * as type from "../types";
import { takeEvery } from "redux-saga/effects";
import { request } from "graphql-request";

const { USER_PATH } = process.env;


function* setLanguage(data) {
  const token = sessionStorage.getItem("token");
  const { paramsLang } = data.payload;

  const mutation = `
      mutation{
          changeLanguage(token:"${token}",
          paramsLang:{email:"${paramsLang.email}", language:"${paramsLang.language}"})
        }
      `;
  yield request(`${USER_PATH}/api`, mutation);
  yield localStorage.setItem("language", paramsLang.chosenLanguage);
}
function* setLanguageSaga() {
  yield takeEvery(type.CHANGE_LANGUAGE, (data) => setLanguage(data));
}

module.exports = {
  setLanguageSaga
}