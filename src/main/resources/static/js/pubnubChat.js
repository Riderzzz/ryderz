// import {isLoggedIn} from "./auth.js";

import {isLoggedIn} from "./auth.js";
import {appendToChatbox} from "./views/chat.js";

export let pubnub = initPubNub()

unsubscribe()
pubNubListener()







function initPubNub(){
    return new PubNub({
        publishKey : "pub-c-62bc5d65-2a08-407c-8259-890f93d4222d",
        subscribeKey : "sub-c-17f4346c-ca4f-11ec-987b-a6fdca316470",
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
