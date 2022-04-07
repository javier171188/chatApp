import * as red5prosdk from "red5pro-webrtc-sdk";

function publisherStatus() {
  //var field = document.getElementById("status-field");
  let field = {};
  var inFailedState = false;

  function updateStatusFromEvent(event, statusField) {
    // if (inFailedState) {
    //   return;
    // }
    // statusField = typeof statusField !== "undefined" ? statusField : field;
    // var pubTypes = red5prosdk.PublisherEventTypes;
    // var rtcTypes = red5prosdk.RTCPublisherEventTypes;
    // var status;
    // if (event.type === pubTypes.PUBLISH_METADATA) {
    //   return;
    // }
    // switch (event.type) {
    //   case "ERROR":
    //     inFailedState = true;
    //     status = ["ERROR", event.data].join(": ");
    //     break;
    //   case pubTypes.CONNECTION_CLOSED:
    //     status = "Connection closed.";
    //     // TODO: find untrackBitrate
    //     //window.untrackBitrate();
    //     inFailedState = false;
    //     break;
    //   case pubTypes.CONNECT_SUCCESS:
    //     status = "Connection established...";
    //     inFailedState = false;
    //     break;
    //   case pubTypes.CONNECT_FAILURE:
    //     status = "Error - Could not establish connection.";
    //     inFailedState = true;
    //     break;
    //   case pubTypes.PUBLISH_START:
    //     status = "Started publishing session.";
    //     inFailedState = false;
    //     break;
    //   case pubTypes.PUBLISH_FAIL:
    //     status = "Error - Could not start a publishing session.";
    //     inFailedState = true;
    //     break;
    //   case pubTypes.PUBLISH_INVALID_NAME:
    //     status = "Error - Stream name already in use.";
    //     inFailedState = true;
    //     break;
    //   case rtcTypes.MEDIA_STREAM_AVAILABLE:
    //     status = "Media Source available...";
    //     inFailedState = false;
    //     break;
    //   case rtcTypes.PEER_CONNECTION_AVAILABLE:
    //     status = "Peer Connection available...";
    //     break;
    //   case rtcTypes.OFFER_START:
    //     status = "Begin offer...";
    //     break;
    //   case rtcTypes.OFFER_END:
    //     status = "Offer accepted...";
    //     break;
    //   case rtcTypes.ICE_TRICKLE_COMPLETE:
    //     status = "Negotiation complete. Waiting Publish Start...";
    //     break;
    //   case pubTypes.UNPUBLISH_SUCCESS:
    //     status = "Unpublished.";
    //     break;
    // }
    // if (status && status.length > 0) {
    //   statusField.innerText = ["STATUS", status].join(": ");
    // }
  }

  function clearStatusEvent(statusField) {
    // inFailedState = false;
    // statusField = typeof statusField !== "undefined" ? statusField : field;
    // statusField.innerText = "";
  }

  // window.red5proHandlePublisherEvent = updateStatusFromEvent;
  // window.red5proClearPublisherEvent = clearStatusEvent;

  return {
    red5proHandlePublisherEvent: updateStatusFromEvent,
    red5proClearPublisherEvent: clearStatusEvent,
  };
}

module.exports = publisherStatus;
