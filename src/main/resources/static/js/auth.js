import fetchData from "./fetchData.js";
import createView from "./createView.js";
import {githubLinkListener, ifUserUnauthorized} from "./views/Login.js";
import {initPubNub, pubNubListener, unsubscribe} from "./pubnubChat.js";
import {fetchUserData} from "./views/NewsFeed.js";

export let pubnub;

export default function addLoginEvent() {
    githubLinkListener()

    document.querySelector("#login-btn").addEventListener("click", function () {
        let obj = {
            username: document.querySelector("#email").value,
            password: document.querySelector("#password").value,
            grant_type: 'password'
        }

        // these are the only request params /oauth/token accepts in Spring Security
        // need to possibly implement a random bit handshake w/ SHA256 on the password before sending
        //      -> Alternatively, encrypt the entire request body
        let request = {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa('rest-blog-client:secret')
            },
            body: `grant_type=${obj.grant_type}&username=${obj.username}&password=${obj.password}&client_id=rest-blog-client`
        };

        fetchData(
            {
                route: `/oauth/token`
            },
            request).then((data) => {
            if (data.route.error === "unauthorized") {
                ifUserUnauthorized()
                return;
            }
            if (data.route.error === "invalid_grant") {
                ifUserUnauthorized()
                return;
            }

            setTokens(data);

            //inializing pubnub here because this is the point whenever the user has successfully logged in
            pubnubInitWithUserUsername()

            createView("/");
        });
    });
}

/**
 * Gets the Authorization header needed for making requests to protected endpoints
 * This function should be used only after the user is logged in
 * @returns {{Authorization: string, "Content-Type": string}|{"Content-Type": string}}
 */
export function getHeaders() {
    const token = localStorage.getItem("access_token");
    return token
        ? {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`
        }
        : {'Content-Type': 'application/json'};
}

/**
 * Attempts to set the access and refresh tokens needs to authenticate and authorize the client and user
 * @param responseData
 */
function setTokens(responseData) {
    if (responseData.route['access_token']) {
        localStorage.setItem("access_token", responseData.route['access_token']);

    }
    if (responseData.route['refresh_token']) {
        localStorage.setItem("refresh_token", responseData.route['refresh_token']);

    }
}

export function clearLocalStorage() {
    localStorage.clear()
}

export function isLoggedIn() {
    if (localStorage.getItem('access_token')) {
        return true;
    } else {
        return false
    }
}

export function userEmail() {

    if (isLoggedIn()) {
        const accessToken = window.localStorage.getItem("access_token");
        const parts = accessToken.split('.');
        const payload = parts[1];
        const decodedPayload = atob(payload);
        const payloadObject = JSON.parse(decodedPayload);
        return payloadObject.user_name;
    }

    return false;
}

export function pubnubInitWithUserUsername() {
    if (isLoggedIn()) {
        fetchUserData().then(function (data) {
            pubnub = new PubNub({
                publishKey : PUB_KEY,
                subscribeKey : SUB_KEY,
                uuid: data.username
            })
            unsubscribe()
            pubNubListener()
        })
    }

}


