let conferenceState = {
  streams: [],
  microphoneOn: true,
  videoOn: true,
  recording: false,
  red5proStatus: "",
  configuration: {},
  hostSocket: undefined,
  bitrateTrackingTicket: undefined,
  targetPublisher: undefined,
};

export default conferenceState;
