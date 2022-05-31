import {sendMsg, subscribeToChannel, setUUID, fetchOldMessages, pubNubListener, unsubscribe} from "../pubnubChat.js"
import {pubnub} from "../auth.js";
// import {pubnub} from "../auth.js";
// import {userEmail} from "../auth.js";
// import {isLoggedIn, userEmail} from "../auth.js";






let channel = 'app-test-1'

export default function chatTest(props) {

    return `<h1>chat</h1>`
}

export function chatTestEvents() {
    setUUID()
    subscribeToChannel(channel)
    fetchOldMessages(channel)
    sendMsgBtn()
    sendMsgEnter()
    toggleChatboxBtn()
}

export function toggleChatboxBtn() {
    $('.chatbox-btn').click(function () {
        $('.chat-box-container').toggleClass('d-none')
        setFeedToBottom()
    })
}


export function sendMsgBtn() {
    $('.send-msg-btn').click(function (){
        let message = $('#msg')
        let messageText = message.val()
        // let channel = $(this).data("channel")
        message.val("")
        console.log('ready to send: ' + messageText)

        sendMsg(messageText, channel)
    })
}

export function selectFriendsTabListener() {
    $('.friend-tab').click(function () {
        $('.friend-tab').removeClass('friend-highlighted')
        $(this).addClass('friend-highlighted')
        let friendId = $(this).data('id')
        let userId = $('.id').data('userid')

        console.log('clicked on friend with id of: ' + friendId)
        console.log('your id: ' + userId)

        unsubscribe(channel)

        channel = getFriendsChannel(userId, friendId)

        console.log(channel)
        console.log('setting channel to: ' + channel)
        subscribeToChannel(channel)
        fetchOldMessages(channel)
    })
}

export function sendMsgEnter() {
    $('#msg').keypress(function(event){
        var keycode = event.keyCode
        if(keycode == '13'){
            let messageText = $('#msg').val()
            $(this).val("")

            console.log('ready to send: ' + messageText)

            sendMsg(messageText, channel)
        }
    })
}

export function appendToChatbox(message){
    let feed = $('.feed')

    feed.html(feed.html() + `
        <div class="card chat-card">
          <div class="card-body">
              <div class="name">${message.publisher}:</div>
              <div class="message">${message.message.description}</div> 
          </div>
        </div>
    `)
    feed.scrollTop(feed[0].scrollHeight)
}

export function appendOldMessagesToChatBox(messageArray) {

    if (messageArray.channels === null) {
        return
    }

    let feed = $('.feed')
    feed.html("")
    let messages = messageArray.channels[Object.keys(messageArray.channels)[0]]

    for (const msg of messages) {
        // console.log(`${msg.uuid}: ${msg.message.description}`)
        if (msg.uuid === pubnub.getUUID()) {
            feed.html(feed.html() + `
        <div class="card chat-card ms-auto">
          <div class="card-body p-2">
            <div class="name">${msg.uuid}:</div>
            <div class="message">${msg.message.description}</div> 
          </div>
        </div>
        `)
        } else {
            feed.html(feed.html() + `
        <div class="card chat-card me-auto">
          <div class="card-body p-2">
            <div class="name">${msg.uuid}:</div>
            <div class="message">${msg.message.description}</div> 
          </div>
        </div>
        `)
        }
    }
    setFeedToBottom()
}

export function setFeedToBottom() {
    let feed = $('.feed')

    feed.scrollTop(feed[0].scrollHeight)
}


export function chatBoxHtml(friends) {
    // console.log(friends)
    return `<div class="chat-box-container row d-none">
        <div class="contacts col-4 py-3"><hr>${friends.map(friend => `${friendTabs(friend)}`).join("")}</div>
        <div class="chat col-7 p-0">
            <div class="feed m-1"></div>
            <div class="type-bar d-flex">
                <div class="bottom">
                    <div class="input-group">
                      <input type="text" class="form-control" name="msgField" id="msg" data-channel="${channel}" aria-label="Recipient's username" aria-describedby="button-addon2">
                      <button class="btn btn-outline-dark send-msg-btn" type="button" id="button-addon2" data-channel="${channel}">Send</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  
    <div class="chatbox-btn me-2 mb-2">
        <i class="bi bi-chat-dots"></i>
    </div>`
}

function friendTabs(friend) {
    //language=html
    return `
<div class="friend-tab d-flex py-1" data-id="${friend.id}">
    <div class="chat-avatar"><i class="bi bi-person-fill pe-1"></i></div>
    <div class="friend-info">${friend.username}</div>
</div>
<hr>


`
}

export function getFriendsChannel(userId, friendId) {
    console.log(typeof userId, typeof friendId)

    if (userId > friendId) {
        userId += ""
        friendId += ""
        return userId + friendId
    }
    userId += ""
    friendId += ""
    return friendId + userId
}








