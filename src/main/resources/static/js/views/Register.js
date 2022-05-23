import CreateView from "../createView.js"
import {getHeaders} from "../auth.js";

export default function Register(props) {
    // language=HTML
    return `
        <!DOCTYPE html>
        <section class="vh-100 register-bg-image"
                 style="background-image: url('../../images/scenic.jpg');">

            <div class="mask d-flex align-items-center h-100 gradient-custom-3">
                <div class="container h-100">
                    <div class="row d-flex justify-content-center align-items-center h-100">
                        <div class="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div class="card" style="border-radius: 15px;">
                                <div class="card-body create-account-form">
                                    <h2 class="text-uppercase text-center mb-5">Create an account</h2>
                                    <form>
                                        <!--                                        <div class="form-outline mb-4">-->
                                        <!--                                            <input type="text" id="form3Example1cg"  class="form-control form-control-lg"/>-->
                                        <!--                                            <label class="form-label" for="form3Example1cg">Your Name</label>-->
                                        <!--                                        </div>-->
                                        
                                        <!-- username input -->
                                        <div class="form-outline mb-4 username-input-card">
                                            <input type="text" class="form-control form-control-lg" id="username" placeholder="Enter username"/>
                                            <label class="form-label" for="form3Example3"></label>
                                        </div>
                                        
                                        <div class="form-outline mb-4">
                                            <input type="email" id="email" class="form-control form-control-lg" placeholder="Enter email"/>
                                            <label class="form-label" for="form3Example3cg"></label>
                                        </div>

                                        <div class="form-outline mb-4">
                                            <input type="password" id="password" class="form-control form-control-lg" placeholder="Enter password"/>
                                            <label class="form-label" for="form3Example4cg"></label>
                                        </div>

                                        <div class="d-flex justify-content-center">
                                            <button type="button"
                                                    class="btn btn-success btn-block btn-lg gradient-custom-4 text-body register-button" id="register-btn"
                                                    aria-describedby="emailHelp">
                                                Register
                                            </button>

                                        </div>
                                        
                                        <div class="d-flex justify-content-center">
                                            <small id="emailHelp" class="form-text">We'll never share your email with anyone
                                                else.
                                            </small>
                                        </div>
                                        
                                        <p class="text-center text-muted mt-5 mb-0">Already have an account?
                                            <a href="#!" class="fw-bold text-body">
                                                <u>Login here</u>
                                            </a>
                                        </p>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <!--        <html>-->
        <!--        <head>-->
        <!--            <meta charset="UTF-8"/>-->
        <!--            <title>Register</title>-->
        <!--        </head>-->
        <!--        <body>-->
        <!--        <h1>Register</h1>-->
        <!--        <form>-->
        <!--            <div class="form-group">-->
        <!--                <label for="username">Username</label>-->
        <!--                <input type="text" class="form-control" id="username" aria-describedby="username"-->
        <!--                       placeholder="Enter username">-->
        <!--                <label for="email">Email address</label>-->
        <!--                <input type="email" class="form-control" id="email" aria-describedby="emailHelp"-->
        <!--                       placeholder="Enter email">-->
        <!--                <small id="emailHelp" class="form-text">We'll never share your email with anyone-->
        <!--                    else.</small>-->
        <!--            </div>-->
        <!--            <div class="form-group">-->
        <!--                <label for="password">Password</label>-->
        <!--                <input type="password" class="form-control" id="password" placeholder="Password">-->
        <!--            </div>-->
        <!--            -->
        <!--            <button type="submit" class="btn btn-primary mt-3 " id="register-btn">Submit</button>-->
        <!--            <hr>-->
        <!--        </form>-->
        <!--        </body>-->
        <!--        </html>-->
    `;
}

export function RegisterEvent() {
    $("#register-btn").click(function () {

        let newUser = {
            username: $("#username").val(),
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
                if (response.status === 500) {
                    ifAccountAlreadyCreated();
                    return;
                }
                CreateView("/login");
            })

    })
}

function ifAccountAlreadyCreated() {
    $("#email").css("border", "1px solid red");
    $("#emailHelp").html("Sorry, that email is already associated with another account.").css("color", "red");
}