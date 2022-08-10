import {isLoggedIn} from "../auth.js";
import {navSearchListener} from "./NewsFeed.js";

export default function Home(props) {
// language=HTML
	return `
        <!DOCTYPE html>
        <html lang="html">
        <head>
            <meta charset="UTF-8"/>
            <title>Home</title>
        </head>
        <body>
        <div class="container">
            <div class="row">
                <div class="welcome-photo">
                    <img class="photo"
                         src="https://images.unsplash.com/photo-1523375592572-5fa3474dda8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80">
                    <div class="welcome-text">
                        ${loginAndRegister()}
                    </div>
                </div>
            </div>

            <div class="d-flex text-center row">
                <h2 class="features-title">Features</h2>
            </div>


            <div class="row justify-content-between">
                <div class="col-12 feature-card home-card-1 col-md-3">
                    <div class="d-flex justify-content-center">
                        <i class="bi bi-calendar-date" style="font-size: 4rem;"></i>
                    </div>
                    <div class="text-center">
                        <div>
                            Host/Join Clubs
                        </div>
                        <p>
                            Host or join events with other motorcyclists
                        </p>
                        <p class="second-features">
                            Choose your date and time!
                        </p>
                    </div>
                </div>

                <div class="col-12 feature-card home-card-2 col-md-3">
                    <div class="d-flex justify-content-center">
                        <i class="bi bi-pin-map" style="font-size: 4rem;"></i>
                    </div>
                    <div class="text-center">
                        <div>
                            Create/View Motorcycle Routes
                        </div>
                        <p class="">
                            Using google's map api, users can set markers on a map to show route start locations
                        </p>
                        <p>
                            Find motorcycle riding events nearby!
                        </p>
                    </div>
                </div>

                <div class="col-12 feature-card home-card-3 col-md-3">
                    <div class="d-flex justify-content-center">
                        <i class="bi bi-person-plus" style="font-size: 4rem;"></i>
                    </div>
                    <div class="text-center">
                        <div>Add/Message Friends</div>
                    </div>
                </div>
            </div>
        </div>
        </body>
        </html>
	`;
}

export function HomeEvent() {
	enableSearchIfLogged()
}

export function enableSearchIfLogged() {
	if (isLoggedIn()) {
		navSearchListener()
	}
}

function loginAndRegister() {
	if (!isLoggedIn()) {
		return `
	<h2 class="welcome-statement">Join our community and go on an adventure today!</h2>
    <div class="d-flex home-button">
            <button class="btn  login-btn"><a class="nav-link text-white" href="/login" data-link="Login">Login</a></button>
             <button class="btn  register-btn"><a class="nav-link text-white" href="/register" data-link="Register">Register</a></button>
    </div>`
	}
	return `<h2 class="welcome-statement">Welcome fellow Rider!</h2>`
}