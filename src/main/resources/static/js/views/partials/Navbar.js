import {getHeaders, isLoggedIn} from "../../auth.js";

export default function Navbar(props) {

	// let data = getData().then(d => {})
	const loggedIn = isLoggedIn();
	if (props != null) {
		console.log(props);
	}
	// console.log(data)
	// language=HTML
	let html = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container d-flex justify-content-between">
                <button class="navbar-toggler order-1" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
				<div class="logo text-white order-2 order-lg-1">LogoPlaceHolder</div>
                <div class="collapse navbar-collapse justify-content-end order-4 order-lg-2" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto align-items-center">
                        <li class="nav-item">
                            <a class="nav-link" href="/" data-link>Home</a>
                        </li>`;
	// language=HTML
	if (loggedIn) {
		html = html + `
			<li class="nav-item">
				<a class="nav-link" href="/chatTest" data-link>Chat</a>
			</li>
            <li class="nav-item">
                <a class="nav-link" href="/newsfeed" data-link>News Feed</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/discover" data-link>Discover</a>
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
            <li class="nav-item d-lg-none">
                <a class="nav-link" href="/user" data-link>User Info</a>
            </li>
            <li class="nav-item d-lg-none">
                <a class="nav-link" href="/logout" data-link>Logout</a>
            </li>
			<li class="nav-item d-none d-lg-block">
				<form class="d-flex">
					<input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
				</form>
			</li>
			`;
	} else {
		// language=HTML
		html = html + `
            <li class="nav-item">
                <a class="nav-link" href="/login" data-link>Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/register" data-link>Register</a>
            </li>
		`;
	}
	// language=HTML
	html = html + `
        </ul>
        </div> `

		if (isLoggedIn()) {
			html +=
				`
				<div class="your-profile order-3 order-lg-3">
					<div class="btn-group dropstart">
						<button type="button" class="btn btn-secondary dropdown-toggle p-0 navbar-profile" data-bs-toggle="dropdown" aria-expanded="false">
							<i class="bi bi-person-circle comment-avatar text-white"></i>
						</button>
	
						<ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton1">
							<li><a class="dropdown-item" id="navbarProfile" href="/profile" data-link>Profile</a></li>
							<li><hr class="dropdown-divider m-0"></li>
							<li><a class="dropdown-item" href="/user" data-link="User Info">Setting</a></li>
							<li><hr class="dropdown-divider m-0"></li>
							<li><a class="dropdown-item" href="/logout" data-link>Logout</a></li>
						</ul>
					</div>
				</div>`
		}

    html +=`</div>
        </nav>`;
	return html;
}




