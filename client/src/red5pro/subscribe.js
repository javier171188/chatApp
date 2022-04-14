import store from "../redux/store.js";
import * as types from "../redux/types.js";
import {
  getConferenceSubscriberElementId,
  ConferenceSubscriberItem,
} from "./conference-subscriber.js";
import {
  getSocketLocationFromProtocol,
  getAuthenticationParams,
  getUserMediaConfiguration,
} from "./settings.js";

const action = ({ type, payload }) =>
  store.dispatch({
    type,
    payload,
  });

var subscribersEl = document.getElementById("subscribers");

function processStreams(streamlist, exclusion) {
  const state = store.getState();
  const configuration = state.conferenceArea.configuration || {};

  var nonPublishers = streamlist.filter(function (name) {
    return name !== exclusion;
  });
  var list = nonPublishers.filter(function (name, index, self) {
    return (
      index == self.indexOf(name) &&
      !document.getElementById(getConferenceSubscriberElementId(name))
    );
  });

  action({ type: types.UPDATE_STREAMS, payload: nonPublishers });

  var subscribers = list.map(function (name, index) {
    return new ConferenceSubscriberItem(name, subscribersEl, index);
  });
  var i,
    length = subscribers.length - 1;
  var sub;
  for (i = 0; i < length; i++) {
    sub = subscribers[i];
    sub.next = subscribers[sub.index + 1];
  }
  if (subscribers.length > 0) {
    var baseSubscriberConfig = Object.assign(
      {},
      configuration,
      {
        protocol: getSocketLocationFromProtocol().protocol,
        port: getSocketLocationFromProtocol().port,
      },
      getUserMediaConfiguration({
        audio: configuration.useAudio,
        video: configuration.useVideo,
      })
    );
    subscribers[0].execute(baseSubscriberConfig);
  }
}

function establishSocketHost(publisher, roomName, streamName) {
  const state = store.getState();
  let hostSocket = state.conferenceArea.hostSocket;
  if (hostSocket) return;
  var wsProtocol = process.env.SOCKET_PROTOCOL || "ws";
  const socketEndpoint = process.env.CONFERENCE_ENDPOINT || "localhost:8001";
  var url = `${wsProtocol}://${socketEndpoint}?room=${roomName}&streamName=${streamName}`;
  hostSocket = new WebSocket(url);
  action({ type: types.SET_HOST_SOCKET, payload: hostSocket });
  hostSocket.onmessage = function (message) {
    var payload = JSON.parse(message.data);
    if (roomName === payload.room) {
      let streamsList = payload.streams;
      processStreams(streamsList, streamName);
    }
  };
}

module.exports = { establishSocketHost };
