
export default function About(props) {
    return `
    <div class="main-card container first-card">
        <div class="h1 story__name block_text story-title--desktop" style="text-align: center;">
        Our development Process
        </div>
        <div class="our-story-card d-flex row">
            <h2>Ryderz Capstone</h2>
            <div id="capstone-card" class="col-6">
                <div>
                Given 4 weeks our group was tasked with creating very own programming design/implementation as our final project. After many hours of deliberation and the fact that we were the last group to decide. Our group decided to create a social media site for motorcycle riders looking to meet up for pre-planned routes.
                </div>
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
   <div class="h1 story__name block_text story-title--desktop" style="text-align: center;">
        About Us
   </div>
<!----about us cards----->
<div class="second-about-section">
   <div class="row">
  <div class="column">
    <div class="about-card">
      <img src="../../images/doggie.png" alt="Jane" style="width:100%">
      <div class="container about-container">
        <h2>Jane Doe</h2>
        <p class="about-card-title">Full-Stack Developer</p>
        <p>Some text that describes me lorem ipsum ipsum lorem.</p>
        <p>example@example.com</p>
        <p><button class="about-card-button">Contact</button></p>
      </div>
    </div>
  </div>
  
  <div class="column">
    <div class="about-card about-container">
      <img src="../../images/hector.jpg" alt="Hector" style="width:100%; height:80%">
      <div class="container">
        <h2>Hector Mejia</h2>
        <p class="about-card-title">Full-Stack Developer</p>
        <p>Interested in working with some enterprise code!</p>
        <p>mejiah6060@gmail.com</p>
        <p><button class="about-card-button">Contact</button></p>
      </div>
    </div>
  </div>
  
  <div class="column">
    <div class="about-card">
      <img src="../../images/doggie.png" alt="Irvin" style="width:100%; height:80%">
      <div class="container about-container">
        <h2>Irvin Ruiz</h2>
        <p class="about-card-title">Full-Stack Developer</p>
        <p>Some text that describes me lorem ipsum ipsum lorem.</p>
        <p>example@example.com</p>
        <p><button class="about-card-button">Contact</button></p>
      </div>
    </div>
  </div>
  
  <div class="column">
    <div class="about-card">
      <img src="../../images/arrow.jpg" alt="Jane" style="width:100%">
      <div class="container about-container">
        <h2>Jane Doe</h2>
        <p class="about-card-title">Full-Stack Developer</p>
        <p>Some text that describes me lorem ipsum ipsum lorem.</p>
        <p>example@example.com</p>
        <p><button class="about-card-button">Contact</button></p>
      </div>
    </div>
  </div>
</div>
</div>
    `;
}
    export function capstoneText() {
        $('#week-1').hover(
            function() {
                $('#capstone-card').html("Week 1 we used a skeleton of our rest blog to set up the foundation of our backend. Some of the methodology used includes SpringBoot for a relational database, javascript/jQuery, Oauth, ");
            }, function() {
                $('#capstone-card').html("Given 4 weeks our group was tasked with creating our very own programming design/implementation as our final project. After many hours of deliberation and the fact that we were the last group to decide. Our group decided to create a social media site for motorcycle riders looking to meet up for pre-planned routes.");
            }
        );$('#week-2').hover(
            function() {
                $('#capstone-card').html("Week 2 most of the time was spent setting up group events allowing users to log into their own accounts to create public group ride events");
            }, function() {
                $('#capstone-card').html("Given 4 weeks our group was tasked with creating our very own programming design/implementation as our final project. After many hours of deliberation and the fact that we were the last group to decide. Our group decided to create a social media site for motorcycle riders looking to meet up for pre-planned routes.");
            }
        );$('#week-3').hover(
            function() {
                $('#capstone-card').html("Week 3");
            }, function() {
                $('#capstone-card').html("Given 4 weeks our group was tasked with creating very own programming design/implementation as our final project. After many hours of deliberation and the fact that we were the last group to decide. Our group decided to create a social media site for motorcycle riders looking to meet up for pre-planned routes.");
            }
        );$('#week-4').hover(
            function() {
                $('#capstone-card').html("Week 4");
            }, function() {
                $('#capstone-card').html("Given 4 weeks our group was tasked with creating very own programming design/implementation as our final project. After many hours of deliberation and the fact that we were the last group to decide. Our group decided to create a social media site for motorcycle riders looking to meet up for pre-planned routes.");
            }
        );
    }