import {requestPost} from "./request";

export function getSenderInfo(sender){
  return requestPost({
    url:'/senderInfo',
    data:{
      sender
    }
  })
}

export function getOfflineMessage(user){
  return requestPost({
    url:'/offlineMessage',
    data:{
      user
    }
  })
}

export function deleteOfflineMessage(user){
  return requestPost({
    url:'/deleteOfflineMessage',
    data:{
      user
    }
  })
}

