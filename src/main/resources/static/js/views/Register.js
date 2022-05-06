import CreateView from "../createView.js"
import {getHeaders} from "../auth.js";

export default function Register(props) {
    // language=HTML
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8"/>
            <title>Register</title>
        </head>
        <body>
        <h1>Register</h1>
        <form>
            <div class="form-group">
                <label for="email">Email address</label>
                <input type="email" class="form-control" id="email" aria-describedby="emailHelp"
                       placeholder="Enter email">
                <small id="emailHelp" class="form-text">We'll never share your email with anyone
                    else.</small>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Password">
            </div>
            
            <button type="submit" class="btn btn-primary mt-3 " id="register-btn">Submit</button>
            <hr>
        </form>
        </body>
        </html>
    `;
}

export function RegisterEvent() {
    $("#register-btn").click(function () {

        let newUser = {
            username: $("#email").val(),
            email: $("#email").val(),
            password: $("#password").val()
        }

        console.log(newUser);

        let request = {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(newUser)
        }

        fetch("http://localhost:8081/api/users", request)
            .then(response => {
                if (response.status === 500){
                    ifAccountAlreadyCreated();
                    return;
                }
                CreateView("/login");
            })

    })
}

function ifAccountAlreadyCreated(){
    $("#email").css("border", "1px solid red");
    $("#emailHelp").html("Sorry, that email is already associated with another account.").css("color", "red");
}