function unpublish() {
  if (hostSocket !== undefined) {
    hostSocket.close();
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
window.addEventListener("beforeunload", shutdown);
window.addEventListener("pagehide", shutdown);
