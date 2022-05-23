import {isLoggedIn} from "../auth";

export default function About(props) {
    return `
    <div class="main-card container">
        <div class="our-story-card d-flex row">
            <div id="capstone-card" class="col-6">
                <h2>Ryderz Capstone</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam aperiam, architecto atque consectetur culpa cumque eaque, earum hic laboriosam nobis odio pariatur perferendis qui, quisquam sapiente sit tempore temporibus.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi fugiat, impedit laudantium quibusdam quidem quisquam tempore. Alias aliquam delectus fugit laudantium soluta? Accusantium debitis dicta recusandae sed sit temporibus tenetur.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad consequatur culpa delectus dicta dolorum ea et eveniet illo itaque, laborum, numquam quis recusandae sapiente tempore tenetur! Et eum quae sapiente?</p>
                <div>
                    ${showText()}
                </div> 
            </div>
            <div class="col-6 d-flex row weeks-card">
                <div id="week-2" class="col-6">
                week 2
                </div>
                <div id="week-3" class="col-6">
                week 3
                </div>
                <div id="week-4" class="col-6">
                week 4
                </div>
                <div id="week-1" class="col-6" onclick="whichWeek()">
                week 1
                </div>
            </div>
        </div>
    </div>
   
<!--../../images/password-icon.png-->
    `;
}

function whichWeek() {
    if($(this).getElementById().slice(-1) === 1 ) {
        return `<div>
                    week 1 we set in place the backend using a skeleton of the rest blog.
                </div>`
    }
}

$('#codeup').hover(
    function() {
        $(this).css('background-color', '#FF0');
    },
    function() {
        $(this).css('background-color', '#FFF');
    }
);

//  function showText() {
//     if (whichWeek()) {
//         return `<div class="d-flex justify-content-end">
//                                 <button class="btn btn-dark mx-2 w-100"><a class="nav-link text-white" href="/login" data-link="Login">Login</a></button>
//                                 <button class="btn btn-dark mx-2 w-100"><a class="nav-link text-white" href="/register" data-link="Register">Register</a></button>
//                             </div>`
//     }
// }