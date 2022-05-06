import {isLoggedIn} from "../../auth.js";

export default function Navbar(props) {
    const loggedIn = isLoggedIn();
    // language=HTML
    let html = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/" data-link>Home</a>
                    </li>`;
            // language=HTML
            if (loggedIn) {
                html = html + `
                    <li class="nav-item">
                        <a class="nav-link" href="/posts" data-link>Posts</a>
                    </li>`;
            }
                // language=HTML
                html = html + `
                    <li class="nav-item">
                        <a class="nav-link" href="/about" data-link>About</a>
                    </li>`;
            // language=HTML
            if (loggedIn) {
                html = html + `
                    <li class="nav-item">
                        <a class="nav-link" href="/user" data-link>User Info</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/logout" data-link>Logout</a>
                    </li>`;
            } else {
                // language=HTML
                html = html + `
                    <li class="nav-item">
                        <a class="nav-link" href="/login" data-link>Login</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/register" data-link>Register</a>
                    </li>`;
            }
    // language=HTML
    html = html + `
                </ul>
            </div>
        </nav>`;
    return html;
}
