import CreateView from "../createView.js";

export default function User(props) {
    //language=HTML
    return `
        <div>
            <h1 id="show-id">${props.user.id}</h1>
            <h1 id="show-username">${props.user.username}</h1>
            <h1 id="show-email">${props.user.email}</h1>
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
            <form>
                <label>Update password</label>
                <input class="update-password" type="password" id="update-password-input"
                       data-id="${props.user.id}">
                <button class="update-password-btn" type="button" id="update-password-button"
                        data-id="${props.user.id}">Submit
                </button>
            </form>
        </div>
    `
}

export function UserEvent() {
    $(".update-password-btn").click(function () {
        const id = $(this).data("id");
        const newPassword = $("#update-password-input").val()



        let request = {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newPassword)
        }

        fetch(`http://localhost:8081/api/users/${id}/updatePassword?newPassword=${newPassword}`, request)
            .then(response => {
                CreateView("/user")
            });

    })
}




