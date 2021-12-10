const addUserGql = `
      mutation addUserGql($token:String, $currentId:String, $searchUser:AddedUser){
          addUser(token: $token, currentId: $currentId, searchUser:$searchUser ){
              _id
              userName
              email
              hasAvatar
              language
                      contacts{
                email
                newMsgs
                status
                userName
                _id
              }
                      conversations{
                newMsgs
                participants{
                                      joinDate
                    userName
                    _id
                }
                roomId
                roomName
              }
          }
      }`;

const addUsersToRoom = `
      mutation addUsersToRoom($token:String, $newRoomParams:NewRoomParams){
          newRoom(token:$token,
          newRoomParams: $newRoomParams)
      }
      `;

const confirmAddingGql = `
      mutation confirmAddingGql($token:String, $participants:[String]){
          confirmAdding(token: $token, participants: $participants )
      }`;

const changeLanguage = `
      mutation changeLanguage($token:String, $paramsLang:ParamsLang){
          changeLanguage(token:$token,
          paramsLang:$paramsLang)
        }
      `;

const createNewRoomGQL = `
      mutation createNewRoomGQL($token:String, $roomName:String, $roomId:String, $participants:[RoomParticipant]){
          createNewRoom(token: $token, roomName: $roomName,  participants:$participants, roomId:$roomId, newMsgs:true )
                         
      }`;

const registerUserGQL = `
      mutation registerUserGQL($userName:String, $email:String, $password:String){
          registerUser(userName: $userName, email: $email, password: $password){
              user{
                  _id
                  userName
                  email
                  contacts {
                      email
                      newMsgs
                      status
                      userName
                      _id
                  }
                  hasAvatar
                  conversations {
                      newMsgs
                      participants{
                          joinDate
                          userName
                          _id
                      }
                      roomId
                      roomName
                  }
                  language
                }
                token
          }
        }
      `;

const logoutGQL = `
      mutation logoutGQL($token:String){
          logout(token:$token)
        }
      `;

const loginGQL = `
          mutation loginGQL($input:Credentials!){
              login(input:$input ){
                user{
                  _id
                  userName
                  email
                  contacts {
                      email
                      newMsgs
                      status
                      userName
                      _id
                  }
                  hasAvatar
                  conversations {
                      newMsgs
                      participants{
                          joinDate
                          userName
                          _id
                      }
                      roomId
                      roomName
                  }
                  language
                }
                token
              }
            }
          `;

const updateUserGQL = `
mutation updateUserGQL($token:String, $senderId:String, $receiver:UpdatedUser, $newStatus:Boolean, $roomId:String){
    updateUser(token: $token, senderId: $senderId, receiver:$receiver, newStatus:$newStatus, roomId:$roomId )
    }`;

module.exports = {
    addUserGql,
    addUsersToRoom,
    changeLanguage,
    confirmAddingGql,
    createNewRoomGQL,
    loginGQL,
    logoutGQL,
    registerUserGQL,
    updateUserGQL
};