// import {isLoggedIn} from "./auth.js";

import {isLoggedIn} from "./auth.js";
import {appendToChatbox} from "./views/chat.js";

export let pubnub = initPubNub()

unsubscribe()
pubNubListener()







function initPubNub(){
    return new PubNub({
        publishKey : PUB_KEY,
        subscribeKey : SUB_KEY,
        keepalive: true,
        uuid: "william"
    })

    // unsub()
    //
    // pubnub.unsubscribe({
    //     channel: channel
    // })

}

function pubNubListener(){

    const listener = { // <-- extract the listener
        message: function(msg) {
            console.log(msg)
            console.log(msg.publisher + ": " + msg.message.description)
            appendToChatbox(msg)
        },
        presence: function (p) {
            const action = p.leave
            console.log(action)
        }
    }
    pubnub.addListener(listener)
}

export function subscribeToChannel(channel) {
    pubnub.subscribe({
        channels: [channel]
    })
}

export function sendMsg(msg, channel) {
    if (isLoggedIn()) {
        var publishPayload = {
            channel : channel,
            message: {
                description: msg
            }
        }
        pubnub.publish(publishPayload, function(status, response) {
            console.log(status, response);
        })
    }
}

export function unsubscribe() {
    pubnub.unsubscribeAll()
}
