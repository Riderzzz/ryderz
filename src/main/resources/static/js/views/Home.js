import {isLoggedIn} from "../auth.js";

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
        <div class="features-main d-flex ">
            <h2 class="features-title justify-content-center">Features</h2>
            <div class="features-card justify-content-space-around">
                <div class="features">
                Host/Join Clubs
                </div>
                <div class="features">
                Create/View Motorcycle Routes
                </div>
                <div class="features">
                Add/Message Friends
                </div>
            </div>
        </div>
        <div class="features-main d-flex ">
            <h2 class="features-title justify-content-center">Features</h2>
            <div class="features-card justify-content-space-around">
                <div class="features">
                Host/Join Clubs
                </div>
                <div class="features">
                Create/View Motorcycle Routes
                </div>
                <div class="features">
                Add/Message Friends
                </div>
            </div>
        </div>
    `;
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