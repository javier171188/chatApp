const initialState = {
  //Login-logout
  errorMessages: [],
  isAuth: sessionStorage.getItem("token"),
  //User state
  userState: {
    contacts: [],
    email: "",
    hasAvatar: false,
    userName: "",
    _id: "",
    conversations: [],
  },
  //Chat area
  currentMessages: [],
  currentRoomId: "",
  contactStatus: "",
  groupRoom: false,
  currentUserChat: "",
  currentRoomName: "",
  lastRoomChanged: "",
  currentUsers: [],

  //Open 
  addingUser: false,
  drawingAreaOn: false,

  //Search area
  searchMessage: "InitialMessage",
  searchUser: null,

};

export default initialState;
