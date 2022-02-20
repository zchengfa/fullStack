import {requestPost} from "./request";

export function getSenderInfo(sender){
  return requestPost({
    url:'/senderInfo',
    data:{
      sender
    }
  })
}