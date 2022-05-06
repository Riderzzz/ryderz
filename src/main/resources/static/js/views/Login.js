export default function Login(props) {
    return `<!DOCTYPE html>
<html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>Log In</title>
    </head>
    <body>
    <h1>Log In</h1>
        <form>
          <div class="form-group" id="login-form">
            <label for="username">Email address</label>
            <input type="email" class="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter email">
            <small id="wrongMessage"></small>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" placeholder="Password">
          </div>
          <input id ="login-btn" type="submit" value="Log In">
        </form>
    </body>
</html>`;

}

export function ifUserUnauthorized() {
    $("#username").css("border", "1px solid red")
    $("#password").css("border", "1px solid red")
    $("#wrongMessage").html("Please enter a valid Username and/or Password").css("color", "red")
}


