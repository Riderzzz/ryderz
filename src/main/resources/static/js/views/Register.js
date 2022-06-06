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
                            <div class="card-about" style="border-radius: 15px;">
                                <div class="card-body create-account-form">
                                    <h2 class="text-uppercase text-center mb-5">Create an account</h2>
                                    <form>
                                        <!--                                        <div class="form-outline mb-4">-->
                                        <!--                                            <input type="text" id="form3Example1cg"  class="form-control form-control-lg"/>-->
                                        <!--                                            <label class="form-label" for="form3Example1cg">Your Name</label>-->
                                        <!--                                        </div>-->

                                        <!-- username input -->
                                        <div class="form-outline mb-4 username-input-card">
                                            <input type="text" class="form-control form-control-lg" id="username"
                                                   placeholder="Enter username"/>
                                            <label class="form-label" for="form3Example3"></label>
                                        </div>

                                        <div class="form-outline mb-4">
                                            <input type="email" id="email" class="form-control form-control-lg"
                                                   placeholder="Enter email"/>
                                            <label class="form-label" for="form3Example3cg"></label>
                                        </div>

                                        <div class="form-outline mb-4">
                                            <input type="password" id="password" class="form-control form-control-lg"
                                                   placeholder="Enter password"/>
                                            <label class="form-label" for="form3Example4cg"></label>
                                        </div>

                                        <div class="d-flex justify-content-center">
                                            <button type="button"
                                                    class="btn btn-success btn-block btn-lg gradient-custom-4 text-body register-button"
                                                    id="register-btn"
                                                    aria-describedby="emailHelp">
                                                Register
                                            </button>

                                        </div>

                                        <div class="d-flex justify-content-center">
                                            <small id="emailHelp" class="form-text">We'll never share your email with
                                                anyone
                                                else.
                                            </small>
                                        </div>

                                        <p class="text-center text-muted mt-5 mb-0">Already have an account?
                                            <a href="" class="fw-bold text-body">
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