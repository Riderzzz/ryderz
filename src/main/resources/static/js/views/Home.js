import {isLoggedIn} from "../auth.js";

export default function Home(props) {

    return `
        <main>
        
            <div class="pic-large d-none d-lg-block">
                <div class="row">
                    <div class="col-7"></div>
                    <div class="col-5 mt-4">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad cupiditate dicta fugit libero magni minus qui recusandae rem rerum tenetur?</p>
                        <div>
                            ${loginAndRegister()}
                        </div>    
                    </div> 
                </div>            
            </div>
            <div class="pic-small d-lg-none">
            
            </div> 
        </main>
    `;
}

function loginAndRegister() {
    if (!isLoggedIn()) {
        return `<div class="d-flex justify-content-end">
                                <button class="btn btn-dark mx-2 w-100"><a class="nav-link text-white" href="/login" data-link="Login">Login</a></button>
                                <button class="btn btn-dark mx-2 w-100"><a class="nav-link text-white" href="/register" data-link="Register">Register</a></button>
                            </div>`
    }
    return ``
}