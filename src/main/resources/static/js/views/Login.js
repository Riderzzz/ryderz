export default function Login(props) {
    return `<!DOCTYPE html>
<section class="overflow-hidden" xmlns="http://www.w3.org/1999/html">
  <style>
    .background-radial-gradient {
      background-color: hsl(218, 41%, 15%);
      background-image: radial-gradient(650px circle at 0% 0%,
          hsl(218, 41%, 35%) 15%,
          hsl(218, 41%, 30%) 35%,
          hsl(218, 41%, 20%) 75%,
          hsl(218, 41%, 19%) 80%,
          transparent 100%),
        radial-gradient(1250px circle at 100% 100%,
          hsl(218, 41%, 45%) 15%,
          hsl(218, 41%, 30%) 35%,
          hsl(218, 41%, 20%) 75%,
          hsl(218, 41%, 19%) 80%,
          transparent 100%);
    }

    #radius-shape-1 {
      height: 220px;
      width: 220px;
      top: -60px;
      left: -130px;
      background: radial-gradient(#44006b, #ad1fff);
      overflow: hidden;
    }

    #radius-shape-2 {
      border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
      bottom: -60px;
      right: -110px;
      width: 300px;
      height: 300px;
      background: radial-gradient(#44006b, #ad1fff);
      overflow: hidden;
    }

    .bg-glass {
      background-color: hsla(0, 0%, 100%, 0.9) !important;
      backdrop-filter: saturate(200%) blur(25px);
    }
  </style>

  <div class="container px-4 py-md-5 px-md-5 text-center text-lg-start my-2 mt-md-5 mb-md-3">
    <div class="row gx-lg-5 align-items-center mb-5">
      <div class="col-lg-6 mb-4 mb-lg-0" style="z-index: 10">
        <h1 class="my-4 my-md-5 display-5 fw-bold ls-tight" style="color: white">
          Connect With Your <br />
          <span style="color: #A1CCA5">Fellow Ryderz</span>
        </h1>
        <p class="mb-4" style="color: #a9a9a9">
          Send messages, create events and groups, and meet with fellow riderz!
        </p>
      </div>

      <div class="col-lg-6 mb-5 mb-lg-0 position-relative">
        <div id="radius-shape-1" class="position-absolute rounded-circle shadow-5-strong"></div>
        <div id="radius-shape-2" class="position-absolute shadow-5-strong"></div>

        <div class="card card-darker-bg">
          <div class="card-body card-darker-bg px-4 py-5 px-md-5">
            <form>
              <!-- Email input -->
              <div class="form-outline mb-4" id="login-form">
                
                <input type="email" class="form-control settingForm" id="email" aria-describedby="emailHelp" placeholder="Enter Email" />
                <label class="form-label text-white" for="form3Example3">Email</label>
                <small id="wrongMessage"></small>
              </div>

              <!-- Password input -->
              <div class="form-outline mb-4">
                <input type="password" class="form-control settingForm" id="password" placeholder="Password">
                <label class="form-label text-white " for="form3Example4">Password</label>
              </div>

<!--               Submit button -->
              <div class="d-flex justify-content-center">
                <button id ="login-btn" type="submit" value="Log In" class="glow-on-hover-login">
                Login
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<div class="footerLine mx-auto d-flex flex-column">
    <hr>
    <div class="iconLinks d-flex justify-content-between mx-auto">
        <a href="https://github.com/Riderzzz" target="_blank" class="text-white githubLink"><i class="bi bi-github icon-link githubLink"></i></a> 
        <i class="bi bi-twitter icon-link"></i>
        <i class="bi bi-instagram icon-link"></i>
    </div>
</div>
<!-- Section: Design Block -->`;

}

// githubLinkListener()

export function githubLinkListener() {
    $('.githubLink').click(function (){
        window.open("https://github.com/Riderzzz", 'git')
        console.log('clicked github')
    })
}

export function ifUserUnauthorized() {
    $("#username").css("border", "1px solid red")
    $("#password").css("border", "1px solid red")
    $("#wrongMessage").html("Please enter a valid Username and/or Password").css("color", "red")
}


