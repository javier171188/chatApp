var audioTrackClone;
var videoTrackClone;

// function saveSettings() {
//   streamName = streamNameField.value;
//   roomName = roomField.value;
// }
function updateMutedAudioOnPublisher() {
  if (targetPublisher && isPublishing) {
    var c = targetPublisher.getPeerConnection();
    var senders = c.getSenders();
    var params = senders[0].getParameters();
    //if (audioCheck.checked) {
    if (true) {
      if (audioTrackClone) {
        senders[0].replaceTrack(audioTrackClone);
        audioTrackClone = undefined;
      } else {
        try {
          targetPublisher.unmuteAudio();
          params.encodings[0].active = true;
          senders[0].setParameters(params);
        } catch (e) {
          // no browser support, let's use mute API.
          targetPublisher.unmuteAudio();
        }
      }
    } else {
      try {
        targetPublisher.muteAudio();
        params.encodings[0].active = false;
        senders[0].setParameters(params);
      } catch (e) {
        // no browser support, let's use mute API.
        targetPublisher.muteAudio();
      }
    }
  }
}

function updateStatistics(b, p, w, h) {
  statisticsField.classList.remove("hidden");
  bitrateField.innerText = b === 0 ? "N/A" : Math.floor(b);
  packetsField.innerText = p;
  resolutionField.innerText = (w || 0) + "x" + (h || 0);
}

function onResolutionUpdate(w, h) {
  // frameWidth = w;
  // frameHeight = h;
  // updateStatistics(bitrate, packetsSent, frameWidth, frameHeight);
}

function updateMutedVideoOnPublisher() {
  if (targetPublisher && isPublishing) {
    //if (videoCheck.checked) {
    if (true) {
      if (videoTrackClone) {
        var c = targetPublisher.getPeerConnection();
        var senders = c.getSenders();
        senders[1].replaceTrack(videoTrackClone);
        videoTrackClone = undefined;
      } else {
        targetPublisher.unmuteVideo();
      }
    } else {
      targetPublisher.muteVideo();
    }
  }
  // !videoCheck.checked && showVideoPoster();
  // videoCheck.checked && hideVideoPoster();
  true && hideVideoPoster();
}

function showVideoPoster() {
  publisherVideo.classList.add("hidden");
}

function hideVideoPoster() {
  publisherVideo.classList.remove("hidden");
}

function getAuthenticationParams(configuration) {
  var auth = configuration.authentication;
  return auth && auth.enabled
    ? {
        connectionParams: {
          username: auth.username,
          password: auth.password,
        },
      }
    : {};
}

function getUserMediaConfiguration(configuration) {
  return {
    mediaConstraints: {
      audio: configuration.audio,
      video: configuration.video,
    },
  };
}

function updateInitialMediaOnPublisher(targetPublisher) {
  var t = setTimeout(function () {
    // If we have requested no audio and/or no video in our initial broadcast,
    // wipe the track from the connection.
    var audioTrack = targetPublisher.getMediaStream().getAudioTracks()[0];
    var videoTrack = targetPublisher.getMediaStream().getVideoTracks()[0];
    var connection = targetPublisher.getPeerConnection();

    //if (!videoCheck.checked) {
    if (false) {
      videoTrackClone = videoTrack.clone();
      connection.getSenders()[1].replaceTrack(null);
    }
    //if (!audioCheck.checked) {
    if (false) {
      audioTrackClone = audioTrack.clone();
      connection.getSenders()[0].replaceTrack(null);
    }
    clearTimeout(t);
  }, 2000);
  // a bit of a hack. had to put a timeout to ensure the video track bits at least started flowing :/
  //This hack came with the example ._.
}

function getSocketLocationFromProtocol() {
  return {
    protocol: process.env.SOCKET_PROTOCOL || "ws",
    port: process.env.WS_PORT || "5080",
  };
}

module.exports = {
  getAuthenticationParams,
  getUserMediaConfiguration,
  getSocketLocationFromProtocol,
  updateInitialMediaOnPublisher,
};
