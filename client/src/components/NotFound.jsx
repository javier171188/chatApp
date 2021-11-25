import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/components/NotFound.css";

const NotFound = () => {
  const { t, i18n } = useTranslation();
  return (
        <>
        <h1>
            <p>{t("We could not find what you are looking for.")} </p>
            <p>{t("Did you spell correctly the address?")}</p>
        </h1>
        <div>
            {t("Go")} &nbsp;
            <Link to='/chat/'>
                {t("Home!")}
            </Link>
        </div>
        </>
  );
};

export default NotFound;
