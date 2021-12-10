const getUser = `query getUser($email:String, $token:String){
    getUser(email:$email, token:$token, selfUser:true) {
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

const lookForUserGQL = `query getUser($email:String, $token:String){
    getUser(email:$email, token:$token, selfUser:false) {
    _id
    userName
    email
        }
    }`;
module.exports = {
    getUser,
    lookForUserGQL
}