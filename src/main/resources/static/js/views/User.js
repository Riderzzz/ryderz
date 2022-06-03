import CreateView from "../createView.js";
import {clearLocalStorage, getHeaders} from "../auth.js";
import createView from "../createView.js";

export default function User(props) {
	console.log(props)
	//language=HTML
	let html = `
		
		<div class="background">
			<div class="dashboard row mx-auto pt-5">
				<div class="tabs col-3">
					<div class="user-image d-flex flex-column my-3 align-items-center">
						<img class="shadow-profile-picture rounded-circle"
							 src="${props.user.userPhotoUrl}"
							 style="width: 150px; height: 150px; aspect-ratio: 1/1" alt="">
						<div class="my-2"><h4>${props.user.username}</h4></div>
					</div>
					<div>
						<ul class="list-group list-group-flush">
							<li class="list-group-item setting-tab setting-tab-highlighted" data-id="1"><i class="bi bi-house-fill"></i> Account</li>
							<li class="list-group-item setting-tab" data-id="2"><i class="bi bi-key-fill"></i> Password</li>
							<li class="list-group-item setting-tab" data-id="3"><i class="bi bi-radioactive"></i> Remove account</li>
						</ul>
					</div>
				</div>
				<div class="contentForm col-9">
					<div class="account">${accountSettingsHtml(props)}</div>
					<div class="password d-none">${passwordSettingsHtml(props)}</div>
					<div class="remove-account d-none">${removeAccountSettingsHtml(props)}</div>
				</div>
			</div>
		</div>
		
		
		
		
		
		
		
		
        <div class="container d-none">
			<h1 class="text-center mt-4">Hello ${props.user.username}</h1>
            <div class="row mt-4">
                <div class="col-md-7">
					<h2>Your Info</h2>
					<small>To edit click on the editable fields</small>
                    <h5 id="show-id">User ID: ${props.user.id}</h5>
                    <h5>Username: <span data-username="${props.user.username}" contenteditable="true" id="show-username">${props.user.username}</span></h5>
                    <h5>Email: <span data-email="${props.user.email}" contenteditable="true" id="show-email">${props.user.email}</span></h5>
					
					
					
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
					
                </div>
            </div>
        </div>
	`

	return html;
}

export function UserEvent() {
	tabSelectListener();
	deleteAccountListener();

	editPasswordListener();
	editAvatarImage();
	editHeaderImage();
	editProfileBtnListener();
}

function accountSettingsHtml(props) {
	//language=html
	let html =
		`
			<form class="m-3">
				<div class="row profileForm my-3">
					<div class="col">
						<div>Avatar</div>
						<div class="input-group">
							<input type="file" class="form-control settingForm" id="userAvatarFile" data-id="${props.user.id}" title="${props.user.profilePicture}">
						</div>
					</div>
					<div class="col">
						<div>Header</div>
						<div class="input-group">
							<input type="file" class="form-control settingForm" id="userHeaderFile" data-id="${props.user.id}">
						</div>
					</div>
				</div>
				<div class="row profileForm my-3">
					<div class="col">
						<label for="usernameForm">Username</label>
						<input type="text" class="form-control settingForm" aria-label="username" id="usernameForm" value="${props.user.username}">
					</div>
					<div class="col">
						<label for="emailForm">Email</label>
						<input type="text" class="form-control settingForm"  aria-label="email" id="emailForm" value="${props.user.email}">
					</div>
				</div>
				<div class="my-3 d-flex align-items-center">
					<button class="edit-profile btn btn-lightG" data-id="${props.user.id}">Save Edits</button>
					<div class="mx-3" id="validation"></div>
				</div>
			</form>
			
		`

	return html;
}

function passwordSettingsHtml(props) {
	//language=html
	let html =
		`
			<form class="m-3">
				<div class="row my-3">
					<div class="col-6">
						<label for="oldPassword">Current password</label>
						<input type="password" class="form-control settingForm" aria-label="First name" id="oldPassword">
					</div>
				</div>
				<div class="row my-3">
					<div class="col">
						<label for="update-password-input">New password</label>
						<input type="password" class="form-control settingForm update-password" aria-label="First name" 
							   id="update-password-input" data-id="${props.user.id}">
					</div>
					<div class="col">
						<label for="confirmPassword">Confirm password</label>
						<input type="password" class="form-control settingForm" aria-label="Last name" id="confirmPassword">
					</div>
					<div class="my-3 d-flex align-items-center">
						<button class="update-password-btn btn btn-lightG" type="button" id="update-password-button"
								data-id="${props.user.id}">Submit
						</button>
						<div class="mx-3" id="password-validation"></div>
					</div>
				</div>
			</form>
		`

	return html;
}

function removeAccountSettingsHtml(props) {
	//language=html
	let html =
		`
			
			<div class="m-3">
				<h1>Remove account</h1>
				<div class="my-3">
					Removing your account will permanently delete it forever, along with all your posts, event, and clubs.
				</div>
				<div class="row my-3">
					<div class="col-6">
						<label for="currentPassword">Your password</label>
						<input type="password" class="form-control settingForm" aria-label="First name" id="currentPassword">
					</div>
				</div>
				<div class="my-3 d-flex align-items-center">
					<button type="button" class="btn btn-red delete-account-btn" data-id="${props.user.id}">Remove</button>
					<div class="mx-3" id="delete-account-validation"></div>
				</div>
			</div>
			
		`

	return html;
}

function editHeaderImage() {
	$('#userHeaderFile').on('change', function () {
		const userId = $(this).data('id');
		const file = document.getElementById("userHeaderFile");
		let image = file.files[0]
		console.log(image.image)
		console.log(file.files)

		// $('.user-image').append(`<img src="${image.image}" alt="">`)

		let formData = new FormData();
		formData.append("file", file.files[0]);

		const requestObject = {
			method: "POST",
			body: formData
		}

		fetch(`http://localhost:8081/api/users/changeHeader/${userId}`, requestObject)
			.then(res => {
				console.log(res.status)
				if (res.status !== 200) {
					console.log(res);
				}
			})
			.catch(error => {
				console.log(error);
				// warningPTag.text("Error submitting changes!");
				// warningPTag.css("color", "red");
			})
			.finally(() => createView('/user'))
	})
}

function editAvatarImage() {
	$('#userAvatarFile').on('change', function (){
		const userId = $(this).data('id');
		const file = document.getElementById("userAvatarFile");
		let image = file.files[0]
		console.log(image.image)
		console.log(file.files)

		// $('.user-image').append(`<img src="${image.image}" alt="">`)

		let formData = new FormData();
		formData.append("file", file.files[0]);

		const requestObject = {
			method: "POST",
			body: formData
		}

		fetch(`http://localhost:8081/api/users/changeAvatar/${userId}`, requestObject)
			.then(res => {
				console.log(res.status)
				if (res.status !== 200) {
					console.log(res);
				}
			})
			.catch(error => {
				console.log(error);
				// warningPTag.text("Error submitting changes!");
				// warningPTag.css("color", "red");
			})
			.finally(() => createView('/user'))
	})

}

function deleteAccountListener() {
	$('.delete-account-btn').click(function (){
		const userId = $(this).data('id');
		const password = $('#currentPassword').val();
		const validation = $('#delete-account-validation')

		if (password.length === 0) {
			validation.text("Password invalid!")
			validation.css('color', 'red')
			return;
		}

		let requestObject = {
			method: "DELETE",
			headers: getHeaders(),
			body: password
		}

		fetch(`http://localhost:8081/api/users/deleteAccount/${userId}`, requestObject).then(r => {
			if (r.status === 200) {
				clearLocalStorage()
				createView('/')
			}
			if (r.status === 202) {
				validation.text("Password invalid!")
				validation.css('color', 'red')
			}
		})
	})
}

function tabSelectListener() {
	$('.setting-tab').click(function (){
		$('.setting-tab').removeClass('setting-tab-highlighted')
		$(this).addClass('setting-tab-highlighted')

		let id = $(this).data('id')

		let account = $('.account')
		let password = $('.password')
		let removeAccount = $('.remove-account')

		account.addClass('d-none')
		password.addClass('d-none')
		removeAccount.addClass('d-none')

		switch (id) {
			case 1:
				account.removeClass('d-none')
				break;
			case 2:
				password.removeClass('d-none')
				break;
			case 3:
				removeAccount.removeClass('d-none')
				break;
		}
	})
}

function editPasswordListener(){
	$(".update-password-btn").click(function () {
		const id = $(this).data("id");
		const newPassword = $("#update-password-input").val()
		const confirmPassword = $('#confirmPassword').val()
		const oldPassword = $('#oldPassword').val()
		const validation = $('#password-validation')


		if (confirmPassword !== newPassword) {
			validation.text("Passwords dont match!")
			validation.css("color", "red")
			return;
		}

		if (newPassword.length < 6) {
			validation.text('Password must be atleast 6 characters long!')
			validation.css('color', 'red')
			return;
		}

		let request = {
			method: "PUT",
			headers: getHeaders(),
			body: oldPassword + "," + newPassword
		}

		fetch(`http://localhost:8081/api/users/updateAccountPassword`, request)
			.then(response => {
				if (response.status === 200) {
					createView('/user')
				}
				if (response.status === 202) {
					validation.text("Current password field did not match you password!");
					validation.css('color', 'red')
				}
			});

	})
}

function editProfileBtnListener() {
	$(".edit-profile").click(function () {
		const originalUsername = $("#show-username").data("username");
		const originalEmail = $("#show-email").data("email");
		const userId = $(this).data("id");
		const username = $("#usernameForm").val();
		const email = $("#emailForm").val();
		const validation = $("#validation");

		if (!username || !email) {
			validation.text("Please fill all fields");
			validation.css("color", "red");
			return;
		}

		if (username === originalUsername && email === originalEmail) {
			validation.text("No fields were changed!");
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




