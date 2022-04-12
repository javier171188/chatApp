import store from "../redux/store.js";
import * as types from "../redux/types.js";
import { setTargetPublisherAction } from "../redux/actions";
import { onPublisherEvent } from "./settings.js";

import { untrackBitrate } from "./script/red5pro-utils.js";

const action = ({ type, payload }) =>
  store.dispatch({
    type,
    payload,
  });

function unpublish() {
  const state = store.getState();
  let hostSocket = state.conferenceArea.hostSocket;
  let targetPublisher = state.conferenceArea.targetPublisher;

  if (hostSocket !== undefined) {
    hostSocket.close();
    console.log("This is closed");
    action({ type: types.SET_HOST_SOCKET, payload: undefined });
  }

  const tracks = targetPublisher.getMediaStream().getTracks();
  tracks.forEach((track) => {
    track.stop();
  });
  console.log("Have stopped");
  action({ type: types.UPDATE_STREAMS, payload: [] });

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
    const state = store.getState();
    let targetPublisher = state.conferenceArea.targetPublisher;
    if (targetPublisher) {
      targetPublisher.off("*", onPublisherEvent);
    }
    setTargetPublisherAction(undefined);
  }
  unpublish().then(clearRefs).catch(clearRefs);

  const state = store.getState();
  let bitrateTrackingTicket = state.conferenceArea.bitrateTrackingTicket;

  untrackBitrate(bitrateTrackingTicket);
}

module.exports = shutdown;

// window.addEventListener("beforeunload", shutdown);
// window.addEventListener("pagehide", shutdown);
// console.log("The event listeners were added");
