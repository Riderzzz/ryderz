
export default function About(props) {
    return `
    <div class="main-card container">
        <div class="our-story-card d-flex row">
            <div id="capstone-card" class="col-6">
                <h2>Ryderz Capstone</h2>
                <p id="week-1-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam aperiam, architecto atque consectetur culpa cumque eaque, earum hic laboriosam nobis odio pariatur perferendis qui, quisquam sapiente sit tempore temporibus.</p>
                <p id="week-2-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi fugiat, impedit laudantium quibusdam quidem quisquam tempore. Alias aliquam delectus fugit laudantium soluta? Accusantium debitis dicta recusandae sed sit temporibus tenetur.</p>
                <p id="week-3-text"></p>
            </div>
            <div class="col-6 d-flex row weeks-card">
                <div id="week-2" class="col-6">
                week 2
                </div>
                <div id="week-3" class="col-6">
                week 3
                </div>
                <div id="week-1" class="col-6" >
                week 1
                </div>
                <div id="week-4" class="col-6">
                week 4
                </div>
                
            </div>
        </div>
    </div>
   
<!--../../images/password-icon.png-->
    `;
}

// function whichWeek() {
//     if($(this).slice(-1) === 1 ) {
//         return `<div>
//                     week 1 we set in place the backend using a skeleton of the rest blog.
//                 </div>`
//     }
// }
// function whichWeek()
// {
    export function capstoneText() {
        $('#week-1').hover(
            function () {
                $('#capstone-card').("Week 1 we used the rest blogs skeleton to set up the foundation of our backend. Some of the methods used include");
            }
        );$('#week-2').hover(
            function () {
                $('#capstone-card').html("Week 2 we used the rest blogs skeleton to set up");
            }
        );$('#week-3').hover(
            function () {
                $('#capstone-card').html("Week 3 we used the rest blogs skeleton to set up");
            }
        );$('#week-4').hover(
            function () {
                $('#capstone-card').html("Week 4 we used the rest blogs skeleton to set up");
            }
        );
    }
//  function showText() {
// if($('#week-1').slice(-1) === 1) {
//
//     return `<div>
//                 Week 1 we used the rest blogs skeleton to set up
//             </div>`
// }
//      }
// }