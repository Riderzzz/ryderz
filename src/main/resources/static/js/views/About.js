
export default function About(props) {
    return `
<!----about us cards----->
<div class="card-container-about">
      <div class="card-about">
        <div class="front">
          <img class="about-images" src="../../images/hectors.jpg" alt="hector"/>
        </div>
        <div class="back">
          <div class="details">
            <div class="caption">
              " I have a passion for all things involving blockchain technology"
            </div>
            <h2>Hector Mejia</h2>
            <span>Software Engineer</span>

            <div class="social-icon">
              <a href="#"><i class="fab fa-facebook"></i></a>
              <a href="#"><i class="fab fa-linkedin-in"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
              <a href="#"><i class="fab fa-pinterest"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div class="card-about">
        <div class="front">
          <img src="https://assets.biztimes.com/uploads/2019/06/Madison-Goldbeck-2018.11.30-WEB-300x400.jpg" alt=""/>
        </div>
        <div class="back">
          <div class="details">
            <div class="caption">
              " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              quisquam iure in! Corporis expedita consequatur tenetur rem
              ratione saepe, perferendis ipsam alias quam. Libero illum maxime,
              unde itaque ratione "
            </div>
            <h2>Derek Johnson</h2>
            <span>Senior Illustrator</span>

            <div class="social-icon">
              <a href="#"><i class="fab fa-facebook"></i></a>
              <a href="#"><i class="fab fa-linkedin-in"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
              <a href="#"><i class="fab fa-pinterest"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div class="card-about">
        <div class="front">
          <img
            src="http://masterbeautyphotography.com/wp-content/uploads/2016/11/Low-Key-Portrait_web-300x400.jpg"
            alt=""
          />
        </div>
        <div class="back">
          <div class="details">
            <div class="caption">
              " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              quisquam iure in! Corporis expedita consequatur tenetur rem
              ratione saepe, perferendis ipsam alias quam. Libero illum maxime,
              unde itaque ratione "
            </div>
            <h2>Capella Fiona</h2>
            <span>Senior Designer</span>

            <div class="social-icon">
              <a href="#"><i class="fab fa-facebook"></i></a>
              <a href="#"><i class="fab fa-linkedin-in"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
              <a href="#"><i class="fab fa-pinterest"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div class="card-about">
        <div class="front">
          <img
            src="https://www.tavistockwood.com/wp-content/uploads/2019/03/Frecheville-James-Headshot-300x400.jpg"
            alt=""
          />
        </div>
        <div class="back">
          <div class="details">
            <div class="caption">
              " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              quisquam iure in! Corporis expedita consequatur tenetur rem
              ratione saepe, perferendis ipsam alias quam. Libero illum maxime,
              unde itaque ratione "
            </div>
            <h2>James Bond</h2>
            <span>CEO</span>

            <div class="social-icon">
              <a href="#"><i class="fab fa-facebook"></i></a>
              <a href="#"><i class="fab fa-linkedin-in"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
              <a href="#"><i class="fab fa-pinterest"></i></a>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
    
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