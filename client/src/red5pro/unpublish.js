import store from "../redux/store.js";
import * as types from "../redux/types.js";

import { untrackBitrate } from "./script/red5pro-utils.js";

const action = ({ type, payload }) =>
  store.dispatch({
    type,
    payload,
  });

function unpublish() {
  const state = store.getState();
  let hostSocket = state.conferenceArea.hostSocket;
  if (hostSocket !== undefined) {
    hostSocket.close();
    action({ type: types.SET_HOST_SOCKET, payload: undefined });
  }
  return new Promise(function (resolve, reject) {
    var publisher = targetPublisher;
    publisher
      .unpublish()
      .then(function () {
        onUnpublishSuccess();
        resolve();
      })
      .catch(function (error) {
        var jsonError =
          typeof error === "string" ? error : JSON.stringify(error, 2, null);
        onUnpublishFail("Unmount Error " + jsonError);
        reject(error);
      });
  });
}

function onUnpublishFail(message) {
  isPublishing = false;
  console.error("[Red5ProPublisher] Unpublish Error :: " + message);
}
function onUnpublishSuccess() {
  isPublishing = false;
  console.log("[Red5ProPublisher] Unpublish Complete.");
}

var shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  function clearRefs() {
    if (targetPublisher) {
      targetPublisher.off("*", onPublisherEvent);
    }
    targetPublisher = undefined;
  }
  unpublish().then(clearRefs).catch(clearRefs);
  untrackBitrate(bitrateTrackingTicket);
}

module.exports = shutdown;

// window.addEventListener("beforeunload", shutdown);
// window.addEventListener("pagehide", shutdown);
// console.log("The event listeners were added");
