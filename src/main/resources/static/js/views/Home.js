import {isLoggedIn} from "../auth.js";
import {navSearchListener} from "./NewsFeed.js";

export default function Home(props) {

    return `
        <main>

    <div class="pic-large d-none d-lg-block">
        <div class="row">
            <div class="col-7"></div>
            <div class="col-5 mt-4">
                <p>Come join our community of like-minded riders and go on an adventure today!</p>
                <div>
                    ${loginAndRegister()}
                </div>    
            </div> 
        </div>            
    </div>
    <div class="pic-small d-lg-none">
    
    </div> 
</main>
<div class="features-main">
    <h2 class="features-title d-flex justify-content-center">Features</h2>
</div>
<div class="features-card">
    <div class="features">
        <div>   
            <i class="bi bi-calendar-date" style="font-size: 4rem;"></i>
        </div>
        <div>
            Host/Join Clubs
        </div>
        <p class="first-features"> 
            Host or join events with other motorcylists
        </p>
        <p class="second-features">
         Choose your date and time!
        </p>
    </div>
    <div class="features">
        <div>
            <i class="bi bi-pin-map" style="font-size: 4rem;"></i>
        </div>
        <div>
            Create/View Motorcycle Routes
        </div>
        <p class="first-features"> 
            Using google's map api, users can set markers on a map to show route start locations
        </p>
        <p> 
        Find motorcycle riding events nearby!
        </p>
    </div>
    <div class="features">
        <div>
            <i class="bi bi-person-plus" style="font-size: 4rem;"></i>
        </div>
        <div>
            Add/Message Friends
        </div>
    </div>
</div>
    `;
}

export function HomeEvent() {
    enableSearchIfLogged()
}

export function enableSearchIfLogged(){
    if (isLoggedIn()) {
        navSearchListener()
    }
}

function loginAndRegister() {
    if (!isLoggedIn()) {
        return `
<div class="d-flex justify-content-end">
<button class="btn btn-dark mx-2 w-100"><a class="nav-link text-white" href="/login" data-link="Login">Login</a></button>
<button class="btn btn-dark mx-2 w-100"><a class="nav-link text-white" href="/register" data-link="Register">Register</a></button>
 </div>`
    }
    return ``
}