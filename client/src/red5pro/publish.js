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

// import "./red5Scripts";
// import publisherStatus from "./script/publisher-status.js";
// import { trackBitrate, untrackBitrate } from "./script/red5pro-utils.js";
import * as red5prosdk from "red5pro-webrtc-sdk";
import {
  getUserMediaConfiguration,
  getAuthenticationParams,
  getSocketLocationFromProtocol,
  updateInitialMediaOnPublisher,
} from "./settings.js";
import allowMediaStreamSwap from "./device-selector-utils.js";

//Currently does nothing, we are not updating the state,
//this modified the logs at the top of the user video.
//const { red5proHandlePublisherEvent } = publisherStatus();

var isPublishing = false;

// var serverSettings = (function () {
//   var settings = sessionStorage.getItem("r5proServerSettings");
//   try {
//     return JSON.parse(settings);
//   } catch (e) {
//     console.error(
//       "Could not read server settings from sessionstorage: " + e.message
//     );
//   }
//   return {};
// })();

var configuration = (function () {
  var conf = sessionStorage.getItem("r5proTestBed");
  try {
    return JSON.parse(conf);
  } catch (e) {
    console.error(
      "Could not read testbed configuration from sessionstorage: " + e.message
    );
  }
  console.log(conf);
  return {};
})();
// red5prosdk.setLogLevel(
//   configuration.verboseLogging
//     ? red5prosdk.LOG_LEVELS.TRACE
//     : red5prosdk.LOG_LEVELS.WARN
// );
red5prosdk.setLogLevel(red5prosdk.LOG_LEVELS.WARN);

//var updateStatusFromEvent = red5proHandlePublisherEvent;

var targetPublisher;
var hostSocket;
// var roomName = window.query('room') || 'red5pro'; // eslint-disable-line no-unused-vars
// var streamName = window.query('streamName') || ['publisher', Math.floor(Math.random() * 0x10000).toString(16)].join('-');
//var socketEndpoint = window.query('socket') || 'localhost:8001'
var socketEndpoint = process.env.SOCKET_ENDPOINT || "localhost:8001";

// var roomField = {};
// roomField.value = roomName;
// eslint-disable-next-line no-unused-vars
var publisherContainer = document.getElementById("publisher-container");
var publisherMuteControls = document.getElementById("publisher-mute-controls");
var publisherSession = document.getElementById("publisher-session");
var publisherNameField = document.getElementById("publisher-name-field");
// var streamNameField = {};
// streamNameField.value = streamName;
// var publisherVideo = document.getElementById("red5pro-publisher");
// console.log("here", publisherVideo);
//var audioCheck = document.getElementById('audio-check');
//var videoCheck = document.getElementById('video-check');
//var joinButton = document.getElementById('join-button');
var statisticsField = document.getElementById("statistics-field");
var bitrateField = document.getElementById("bitrate-field");
var packetsField = document.getElementById("packets-field");
var resolutionField = document.getElementById("resolution-field");
var bitrateTrackingTicket;
var bitrate = 0;
var packetsSent = 0;
var frameWidth = 0;
var frameHeight = 0;

//roomField.value = roomName;
//streamNameField.value = streamName;
//audioCheck.checked = configuration.useAudio;
//videoCheck.checked = configuration.useVideo;

// joinButton.addEventListener('click', function () {
//   saveSettings();
//   doPublish(streamName);
//   setPublishingUI(streamName);
// });

function publishStream(streamName) {
  //saveSettings();
  // streamName = streamNameField.value;
  // roomName = roomField.value;
  doPublish(streamName);
  // setPublishingUI(streamName);
}
function doPublish(streamName) {
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

//audioCheck.addEventListener('change', updateMutedAudioOnPublisher);
//videoCheck.addEventListener('change', updateMutedVideoOnPublisher);

// var protocol = serverSettings.protocol;
let protocol = process.env.RED5_PROTOCOL;
var isSecure = protocol == "https";

function onPublisherEvent(event) {
  console.log("[Red5ProPublisher] " + event.type + ".");
  if (event.type === "WebSocket.Message.Unhandled") {
    console.log(event);
  } else if (
    event.type === red5prosdk.RTCPublisherEventTypes.MEDIA_STREAM_AVAILABLE
  ) {
    allowMediaStreamSwap(
      targetPublisher,
      targetPublisher.getOptions().mediaConstraints,
      document.getElementById("red5pro-publisher")
    );
  }
  //updateStatusFromEvent(event);
}
function onPublishFail(message) {
  isPublishing = false;
  console.error("[Red5ProPublisher] Publish Error :: " + message);
}
function onPublishSuccess(publisher, roomName, streamName) {
  isPublishing = true;
  window.red5propublisher = publisher;
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

    bitrateTrackingTicket = trackBitrate(pc, onBitrateUpdate, null, null, true);
    statisticsField.classList.remove("hidden");
    stream.getVideoTracks().forEach(function (track) {
      var settings = track.getSettings();
      onResolutionUpdate(settings.width, settings.height);
    });
  } catch (e) {
    // no tracking for you!
  }
}

function setPublishingUI(streamName) {
  //publisherNameField.innerText = streamName;
  //roomField.setAttribute('disabled', true);
  // publisherSession.classList.remove("hidden");
  // publisherNameField.classList.remove("hidden");
  // publisherMuteControls.classList.remove("hidden");
  // Array.prototype.forEach.call(
  //   document.getElementsByClassName("remove-on-broadcast"),
  //   function (el) {
  //     el.classList.add("hidden");
  //   }
  // );
}

// eslint-disable-next-line no-unused-vars

function establishSocketHost(publisher, roomName, streamName) {
  if (hostSocket) return;
  var wsProtocol = isSecure ? "wss" : "ws";
  var url = `${wsProtocol}://${socketEndpoint}?room=${roomName}&streamName=${streamName}`;
  hostSocket = new WebSocket(url);
  hostSocket.onmessage = function (message) {
    var payload = JSON.parse(message.data);
    if (roomName === payload.room) {
      streamsList = payload.streams;
      processStreams(streamsList, streamName);
    }
  };
}

function determinePublisher(recording, audio, video, streamName) {
  var config = Object.assign(
    {},
    {
      streamMode: recording ? "record" : "live",
    },
    //getAuthenticationParams(),
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
    streamName: streamName,
    room: "Roomy", //<-----------------------------------hardcoded
  });

  var publisher = new red5prosdk.RTCPublisher();
  console.log(rtcConfig);
  return publisher.init(rtcConfig);
}

// function startCall(roomName, streamName) {
function startCall(recording, audio, video, streamName) {
  determinePublisher(recording, audio, video, streamName)
    .then(function (publisherImpl) {
      targetPublisher = publisherImpl;
      targetPublisher.on("*", onPublisherEvent);
      return targetPublisher.preview();
    })
    .then((r) => {
      publishStream(streamName);
      //publishStream("First");
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
