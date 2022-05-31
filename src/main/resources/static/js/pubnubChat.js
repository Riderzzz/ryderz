import {isLoggedIn, pubnub, userEmail} from "./auth.js";
import {appendOldMessagesToChatBox, appendToChatbox} from "./views/chat.js";

let count = 1;

export function initPubNub(){

    return new PubNub({
        publishKey : PUB_KEY,
        subscribeKey : SUB_KEY,
        uuid: userUsername()
    })
}

export function setUUID() {
    let user = userEmail()
    // console.log(user)
    pubnub.set_uuid = user
    console.log(pubnub.uuid)
}



export function pubNubListener(){

    const listener = { // <-- extract the listener
        message: function(msg) {
            // console.log(msg)
            // console.log(msg.publisher + ": " + msg.message.description)
            appendToChatbox(msg)
        },
        presence: function (p) {
            const action = p.leave
            // console.log(action)
        }
    }
    pubnub.addListener(listener)
}

export function subscribeToChannel(channel) {
    pubnub.subscribe({
        channels: [channel]
    })
}

export function sendMsg(msg, currentChannel) {
    if (isLoggedIn()) {
        var publishPayload = {
            channel : currentChannel,
            message: {
                description: msg
            }
        }
        pubnub.publish(publishPayload, function(status, response) {
            // console.log(status, response);
        })
    }
}

export function fetchOldMessages(currentChannel) {

    // console.log(currentChannel)
    pubnub.fetchMessages(
        {
            channels: [currentChannel],
            end: '15343325004275466',
            count: 50
        },
        (status, response) => {
            if (response !== null) {
                appendOldMessagesToChatBox(response)
            }
        }
    );
}

export function unsubscribe(channel) {
    pubnub.unsubscribe({ channels: [channel] });
}
