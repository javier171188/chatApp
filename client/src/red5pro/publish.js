/*
Copyright © 2015 Infrared5, Inc. All rights reserved.
The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code") 
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following  
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying  
code  constitutes your acceptance of the following license terms and conditions.
Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation 
files (collectively, the "Software") without restriction, including without limitation the rights to use, 
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit 
persons to whom the Software is furnished to do so, subject to the following conditions:
The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end 
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.   
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.
The above copyright notice and this license shall be included in all copies or portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT  
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND  
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION 
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
"use strict";

import { trackBitrate } from "./script/red5pro-utils.js";
import * as red5prosdk from "red5pro-webrtc-sdk";
import {
  getUserMediaConfiguration,
  getSocketLocationFromProtocol,
  updateInitialMediaOnPublisher,
  onPublisherEvent,
} from "./settings.js";
import { establishSocketHost } from "./subscribe.js";
import store from "../redux/store.js";
import * as types from "../redux/types.js";
import { setBitrateTrackingTicketAction } from "../redux/actions";

const action = ({ type, payload }) =>
  store.dispatch({
    type,
    payload,
  });

var configuration = (function () {
  var conf = sessionStorage.getItem("r5proTestBed");
  try {
    return JSON.parse(conf);
  } catch (e) {
    console.error(
      "Could not read testbed configuration from sessionstorage: " + e.message
    );
  }
  return {};
})();

red5prosdk.setLogLevel(red5prosdk.LOG_LEVELS.WARN);

var bitrate = 0;
var packetsSent = 0;
var frameWidth = 0;
var frameHeight = 0;

function publishStream(streamName) {
  doPublish(streamName);
}
function doPublish(streamName) {
  const state = store.getState();
  let targetPublisher = state.conferenceArea.targetPublisher;
  targetPublisher
    .publish(streamName)
    .then(function () {
      onPublishSuccess(targetPublisher, streamName);
      updateInitialMediaOnPublisher(targetPublisher);
    })
    .catch(function (error) {
      var jsonError =
        typeof error === "string" ? error : JSON.stringify(error, null, 2);
      console.error("[Red5ProPublisher] :: Error in publishing - " + jsonError);
      console.error(error);
      onPublishFail(jsonError);
    });
}

let protocol = process.env.RED5_PROTOCOL;
var isSecure = protocol == "https";

var isPublishing = false;

function onPublishFail(message) {
  isPublishing = false;
  console.error("[Red5ProPublisher] Publish Error :: " + message);
}

function onBitrateUpdate(b, p) {
  bitrate = b;
  packetsSent = p;

  if (packetsSent > 100) {
    const state = store.getState();
    const roomName = state.chatArea.currentRoomId;
    const streamName = state.userState._id;
    const targetPublisher = state.conferenceArea.targetPublisher;
    establishSocketHost(targetPublisher, roomName, streamName);
  }
}

function onPublishSuccess(publisher, roomName, streamName) {
  isPublishing = true;
  console.log("[Red5ProPublisher] Publish Complete.");
  // [NOTE] Moving SO setup until Package Sent amount is sufficient.
  //    establishSharedObject(publisher, roomField.value, streamNameField.value);
  if (publisher.getType().toUpperCase() !== "RTC") {
    // It's flash, let it go.
    establishSocketHost(publisher, roomName, streamName);
  }
  try {
    var pc = publisher.getPeerConnection();
    var stream = publisher.getMediaStream();

    const bitrateTrackingTicket = trackBitrate(
      pc,
      onBitrateUpdate,
      null,
      null,
      true
    );
    setBitrateTrackingTicketAction(bitrateTrackingTicket);
    stream.getVideoTracks().forEach(function (track) {
      //var settings = track.getSettings();
      //onResolutionUpdate(settings.width, settings.height);
    });
  } catch (e) {
    // no tracking for you!
    console.error(e);
  }
}

function determinePublisher(recording, audio, video, streamName) {
  var config = Object.assign(
    {},
    {
      streamMode: recording ? "record" : "live",
    },
    getUserMediaConfiguration({ audio, video }),
    configuration
  );

  var rtcConfig = Object.assign({}, config, {
    protocol: getSocketLocationFromProtocol().protocol,
    port: getSocketLocationFromProtocol().port,
    bandwidth: {
      video: 256,
    },
    host: process.env.RED5_CONF_HOST || "localhost",
    mediaConstraints: {
      audio,
      video: {
        width: {
          exact: 320,
        },
        height: {
          exact: 240,
        },
        frameRate: {
          exact: 15,
        },
      },
    },
    streamName,
    clearMediaOnUnpublish: true,
  });

  var publisher = new red5prosdk.RTCPublisher();

  return publisher.init(rtcConfig);
}

function startCall(recording, audio, video, streamName) {
  store.dispatch({ type: types.SET_RED5PRO_CONFIG, payload: configuration });

  determinePublisher(recording, audio, video, streamName)
    .then(function (publisherImpl) {
      //setTargetPublisherAction(publisherImpl);
      action({ type: types.SET_TARGET_PUBLISHER, payload: publisherImpl });

      const state = store.getState();
      let targetPublisher = state.conferenceArea.targetPublisher;

      targetPublisher.on("*", onPublisherEvent);
      return targetPublisher.preview();
    })
    .then((r) => {
      publishStream(streamName);
    })
    .catch(function (error) {
      var jsonError =
        typeof error === "string" ? error : JSON.stringify(error, null, 2);
      console.error("[Red5ProPublisher] :: Error in publishing - " + jsonError);
      console.error(error);
      onPublishFail(jsonError);
    });
}

module.exports = { startCall };
