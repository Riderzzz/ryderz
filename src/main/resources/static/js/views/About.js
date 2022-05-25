
export default function About(props) {
    return `
    <div class="main-card container first-card">
        <div class="our-story-card d-flex row">
            <div id="capstone-card" class="col-6">
                <h2>Ryderz Capstone</h2>
                <p id="week-1-text">.</p>
                <p id="week-2-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi fugiat, impedit laudantium quibusdam quidem quisquam tempore. Alias aliquam delectus fugit laudantium soluta? Accusantium debitis dicta recusandae sed sit temporibus tenetur.</p>
                <p id="week-3-text"></p>
            </div>
            <ul class="col-6 d-flex row weeks-card">
                <li id="week-1" class="col-3 week-effects">
                week 1
                </li>
                <li id="week-2" class="col-3 week-effects">
                week 2
                </li>
                <li id="week-3" class="col-3 week-effects" >
                week 3
                </li>
                <li id="week-4" class="col-3 week-effects">
                week 4
                </li>
            </ul>
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
            function() {
                $('#capstone-card').html("Week 1 we used a skeleton of our rest blog to set up the foundation of our backend. Some of the methodology used includes SpringBoot for a relational database, javascript/jQuery, Oauth, ");
            }, function() {
                $('#capstone-card').html("Given 4 weeks our group was tasked with creating our own application as our final project. After many hours of deliberation and the fact that we were the last group to decide. Our group decided to create a social media site for motorcycle riders looking looking to meet up for pre-planned routes.");
            }
        );$('#week-2').hover(
            function() {
                $('#capstone-card').html("Week 2 most of the time was spent setting up group events allowing users to log into their own accounts to create public group ride events");
            }, function() {
                $('#capstone-card').html("Given 4 weeks our group was tasked with creating our own application as our final project. After many hours of deliberation and the fact that we were the last group to decide. Our group decided to create a social media site for motorcycle riders looking looking to meet up for pre-planned routes.");
            }
        );$('#week-3').hover(
            function() {
                $('#capstone-card').html("Week 3");
            }, function() {
                $('#capstone-card').html("Given 4 weeks our group was tasked with creating our own application as our final project. After many hours of deliberation and the fact that we were the last group to decide. Our group decided to create a social media site for motorcycle riders looking looking to meet up for pre-planned routes.");
            }
        );$('#week-4').hover(
            function() {
                $('#capstone-card').html("Week 4");
            }, function() {
                $('#capstone-card').html("Given 4 weeks our group was tasked with creating our own application as our final project. After many hours of deliberation and the fact that we were the last group to decide. Our group decided to create a social media site for motorcycle riders looking looking to meet up for pre-planned routes.");
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