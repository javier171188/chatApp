import * as type from "../types";


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

module.export = {
    setLanguageSaga
}