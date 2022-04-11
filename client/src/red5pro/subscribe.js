var streamsList = [];
var subscribersEl = document.getElementById("subscribers");

function processStreams(streamlist, exclusion) {
  var nonPublishers = streamlist.filter(function (name) {
    return name !== exclusion;
  });
  var list = nonPublishers.filter(function (name, index, self) {
    return (
      index == self.indexOf(name) &&
      !document.getElementById(window.getConferenceSubscriberElementId(name))
    );
  });
  console.log("Here, this is the list: ", list);
  var subscribers = list.map(function (name, index) {
    return new window.ConferenceSubscriberItem(name, subscribersEl, index);
  });
  console.log("Here, subscribers: ", subscribers);
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
      getAuthenticationParams(),
      getUserMediaConfiguration()
    );
    subscribers[0].execute(baseSubscriberConfig);
  }

  //updatePublishingUIOnStreamCount(nonPublishers.length);
}

var hostSocket;
function establishSocketHost(publisher, roomName, streamName) {
  if (hostSocket) return;
  var wsProtocol = process.env.SOCKET_PROTOCOL || "ws";
  const socketEndpoint = process.env.CONFERENCE_ENDPOINT || "localhost:8001";
  var url = `${wsProtocol}://${socketEndpoint}?room=${roomName}&streamName=${streamName}`;
  console.log("Here: ", url);
  hostSocket = new WebSocket(url);
  hostSocket.onmessage = function (message) {
    var payload = JSON.parse(message.data);
    if (roomName === payload.room) {
      streamsList = payload.streams;
      processStreams(streamsList, streamName);
    }
  };
}

function updatePublishingUIOnStreamCount(streamCount) {
  /*
    if (streamCount > 0) {
      publisherContainer.classList.remove('margin-center');
    } else {
      publisherContainer.classList.add('margin-center');
    }
    */
}

module.exports = { establishSocketHost };
