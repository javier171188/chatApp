const initialState = {
    errorMessages: [],
    isAuth: sessionStorage.getItem('token'),
    userState: {
        contacts: [],
        email: "",
        hasAvatar: false,
        userName: "",
        _id: "",
        conversations: []
    },
    currentMessages: [],
    currentRoomId: '',
    contactStatus: '',
    addingUser: false,
    drawingAreaOn: false
};

export default initialState;

// Sideview
{
    setUserState,
        setContactStatus,
        socket,
        currentRoomId,
        setCurrentUserChat,
        setCurrentRoomId,
        setCurrentMessages,
        setCurrentRoomName,
        setGroupRoom
}

// Working area
{ userState, updateUser, socket, setCurrentMessages, currentMessages, currentRoomId }

// ChatView
{
    userState,
        contactStatus,
        setContactStatus,
        currentRoomId,
        setCurrentRoomId,
        currentMessages,
        currentRoomName,
        groupRoom,
        addingUser,
        setAddingUser,
        currentUserChat,
        socket,
        getUserState,
        drawingAreaOn,
        setDrawingAreaOn,
        sendNewMessage
}