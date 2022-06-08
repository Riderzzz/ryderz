
export default function About(props) {
    return `
<!----about us cards----->
<div class="h1 story__name block_text story-title--desktop pt-4" style="text-align: center;">
        About Us
   </div>
    </body>
<body id="about-body">
<div class="card-container-about">
      <div class="card-about">
        <div class="front">
          <img class="about-images" src="../../images/hector.jpg" alt="hector"/>
        </div>
        <div class="back">
          <div class="details">
            <div class="caption">
              " I have a passion for all things involving blockchain technology"
            </div>
            <h2 class="about-names">Hector Mejia</h2>
            <span>Software Engineer</span>
            <div class="social-icon">
              <a href="https://github.com/Hector7Mejia?tab=repositories" target="_blank"><i class="fa-brands fa-github fab"></i></a>
              <a href="https://www.linkedin.com/in/hector-mejia-/"><i class="fab fa-linkedin-in"></i></a>
              <a href="mailto:mejiah6060@gmail.com"><i class="fab fa-google"></i></a>
              <a href="#"><i class="fab fa-pinterest"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div class="card-about">
        <div class="front">
          <img class="about-images" src="../../images/william.jpg" alt="william"/>
        </div>
        <div class="back">
          <div class="details">
            <div class="caption">
              " Dependable and motivated Software Developer with proven leadership experience. Prior work experience in a fast-paced, high-volume takeout restaurant has allowed me to hone my teamwork, customer service, communication. I look forward to bringing my leadership and technical skills to a dynamic team "
            </div>
            <h2 class="about-names">William Withers</h2>
            <span>Software Engineer</span>

            <div class="social-icon">
              <a href="https://github.com/withers56" target="_blank"><i class="fa-brands fa-github fab"></i></a>
              <a href="https://www.linkedin.com/in/william-withers1/"><i class="fab fa-linkedin-in"></i></a>
              <a href="mailto:william.k.withers@gmail.com"><i class="fab fa-google"></i></a>
              <a href="#"><i class="fab fa-pinterest"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div class="card-about">
        <div class="front">
          <img class="about-images"
            src="../../images/irvin.jpg"
            alt="Irvin Ruiz"
          />
        </div>
        <div class="back">
          <div class="details">
            <div class="caption">
              " I am passionate about solving real world problems with technology. As a fast learner I can grasp concepts quickly and understand how they can help improve efficiency. I am a focused individual who likes to work with others and help make the workplace a better place to work "
            </div>
            <h2 class="about-names">Irvin Ruiz</h2>
            <span>Software Engineer</span>

            <div class="social-icon">
              <a href="https://github.com/lucidawareness" target="_blank"><i class="fa-brands fa-github fab"></i></a>
              <a href="https://www.linkedin.com/in/irvinruiz/"><i class="fab fa-linkedin-in"></i></a>
              <a href="mailto:mejiah6060@gmail.com"><i class="fab fa-google"></i></a>
              <a href="#"><i class="fab fa-pinterest"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div class="card-about">
        <div class="front">
          <img class="about-images"
            src="https://ca.slack-edge.com/T029BRGN0-U02PNMFSX2P-8f1b948f42ba-512"
            alt="daniel"
          />
        </div>
        <div class="back">
          <div class="details">
            <div class="caption">
              " United States Marine Corps Veteran and Software Developer with previous secret security clearance and multiple years experience as a technician. A passion for technology, self-improvement, and an eagerness to learn inspired the decision to pursue a full-time career in web development "
            </div>
            <h2 class="about-names">Daniel Ficci</h2>
            <span>Software Engineer</span>

            <div class="social-icon">
              <a href="https://github.com/DFicci" target="_blank"><i class="fa-brands fa-github fab""></i></a>
              <a href="https://www.linkedin.com/in/daniel-ficci/"><i class="fab fa-linkedin-in"></i></a>
              <a href="mailto:danielficci@gmail.com"><i class="fab fa-google"></i></a>
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
            <h2 class="about-names">Ryderz Capstone</h2>
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