import { useTranslation } from "react-i18next";
import "../styles/components/MessageForm.css";

function MessageForm(props) {
  const { t, i18n } = useTranslation();

  const selfUser = props.userState._id === props.sender._id;
  let messageClass = "sender-user";
  if (selfUser) {
    messageClass = "self-user";
  }
  if (props.isImage) {
    return (
      <p className={messageClass} >
        {selfUser
          ? <>{t("SelfUser")}  <img src={props.message} /></>
          : <>{props.sender.userName}: <img src={props.message} /> </>
        }
      </p>
    );
  }
  return (
    <p className={messageClass} >
      {selfUser
        ? t("SelfUser") + props.message
        : `${props.sender.userName}: ${props.message}`
      }
    </p>
  );
}

export default MessageForm;
