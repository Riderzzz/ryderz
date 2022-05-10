import CreateView from "../createView.js";
import {getHeaders} from "../auth.js";
import createView from "../createView.js";

export default function User(props) {
	//language=HTML
	return `
        <div class="container">
			<h1 class="text-center mt-4">Hello ${props.user.username}</h1>
            <div class="row mt-4">
                <div class="col-md-7">
					<h2>Your Info</h2>
					<small>To edit click on the editable fields</small>
                    <h5 id="show-id">User ID: ${props.user.id}</h5>
                    <h5>Username: <span contenteditable="true" id="show-username">${props.user.username}</span></h5>
                    <h5>Email: <span contenteditable="true" id="show-email">${props.user.email}</span></h5>
					<p id="validation"></p>
					<button class="edit-profile btn btn-dark" data-id="${props.user.id}">Save Edits</button>
					
					<h2 class="mt-4">Your Posts (${props.user.posts.length})</h2>
                    <div>${props.user.posts.map(post => {
                        `
                 <div>  
                    <h1 id="title-${post.id}">${post.title}</h1> 
                    <h1 id="content-${post.id}">${post.content}</h1> 
                 </div>
            `
                    }).join('')
                    }
                    </div>
                </div>
                <div class="col-md-5">
					<h2>Update Password</h2>
                    <form>
                        <label>Update password</label>
                        <input class="update-password" type="password" id="update-password-input"
                               data-id="${props.user.id}">
                        <button class="update-password-btn btn btn-dark" type="button" id="update-password-button"
                                data-id="${props.user.id}">Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
	`
}

export function UserEvent() {
	$(".update-password-btn").click(function () {
		const id = $(this).data("id");
		const newPassword = $("#update-password-input").val()

		let request = {
			method: "PUT",
			headers: getHeaders(),
			body: JSON.stringify(newPassword)
		}

		fetch(`http://localhost:8081/api/users/${id}/updatePassword?newPassword=${newPassword}`, request)
			.then(response => {
				CreateView("/user")
			});

	})

	editProfileBtnListener();
}

function editProfileBtnListener() {
	$(".edit-profile").click(function () {
		const userId = $(this).data("id");
		const username = $("#show-username").text();
		const email = $("#show-email").text();
		const validation = $("#validation");

		if (!username || !email) {
			validation.text("Please fill all fields");
			validation.css("color", "red");
			return;
		}

		const user = {
			username,
			email
		}

		const request = {
			method: "PUT",
			headers: getHeaders(),
			body: JSON.stringify(user)
		}

		fetch(`http://localhost:8081/api/users/${userId}`, request)
			.then(res => {
				console.log(res.status)
				window.localStorage.clear()
				alert("Redirecting to login...")
				createView("/login")
			})
			.catch(error => {
				console.log(error)
				createView("/user")
			})
	})
}




