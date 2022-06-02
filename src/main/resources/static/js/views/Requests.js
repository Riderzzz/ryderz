import createView from "../createView.js";
import {getHeaders} from "../auth.js";


const BASE_URI = 'http://localhost:8081/api/users';


export default function Requests(props) {
    console.log(props)
    console.log(props.request[0].sender)
    //language=html
    return `
        <!DOCTYPE html>
        <html lang="html">
        <head>
            <meta charset="UTF-8"/>
            <title>requests</title>
        </head>
        <body>
        <h1>This is your friends requests</h1>
        <div class="d-flex row">
            ${showAllRequests(props)}
        </div>

        </body>
        </html>`
}

export function showRequests() {
    addFriend()
}

function showAllRequests(props) {
    let html = `
       ${props.request.map(m => `
         <div class="card" style="width: 18rem;">
                    <div class="card-body">
                         <h5 class="card-title">${m.sender.username}</h5>
                         <div class="d-flex justify-content-end">
                        <button href="#" class="btn-primary accept-friend" data-id="${m.sender.id}">accept</button>
                        <button href="#" class="btn-danger decline-friend">decline</button>
                        </div>
                    </div>
                </div>
       `).join("")}
       `
    return html;
}

function addFriend() {
    $(".accept-friend").click(function () {
        const id = $(this).data("id");

        const request = {
            method: "POST",
            headers: getHeaders(),
        }

        fetch(`${BASE_URI}/addfriend/${id}`, request)
            .then(res => {
                console.log(res.status);
                createView(`/request`)
            }).catch(error => {
            console.log(error);
            createView(`/request`);
        });

    })
}