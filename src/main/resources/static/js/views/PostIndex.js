import createView from "../createView.js";
import {getHeaders} from "../auth.js";


const BASE_URI = 'http://localhost:8081/api/posts';

export default function PostIndex(props) {
    // language=HTML
    return `
        <header>
            <h1>Posts Page</h1>
        </header>
        <main>
            
            <h3>Feed</h3>
            <div id="posts-container">
                ${props.posts.map(post => {
        return `
<div class="card">
    <h4 class="card-header">
        <span id="title-${post.id}">${post.title}</span>
        <span style="float:right" id="author-${post.id}">Author: ${post.author.username}</span>
    </h4>
    <div class="card-body">
        <p id="content-${post.id}" class="card-text">${post.content}</p>
    </div>
    <div class="card-footer text-muted">            
        ${post.categories.map(category => {
            return `<span class="border border-primary rounded">${category.name}</span>`
        }).join('')}
        <span><a href="#" class="edit-post-button" data-id="${post.id}">Edit</a></span>
        <span><a href="#" class="delete-post-button" data-id="${post.id}">Delete</a></span>
    </div>
</div>`;
    }).join('')}
            </div>
            <hr>
            <h3>Add a Post</h3>
            <form id="add-post-form">
                <div class="mb-3">
                    <input disabled type="text" class="form-control" id="add-post-id" value="0">
                </div>
                <div class="mb-3">
                    <label for="add-post-title" class="form-label">Title</label>
                    <input type="text" class="form-control" id="add-post-title" placeholder="Post title">
                </div>
                <label for="add-post-content" class="form-label">Content</label>
                <textarea class="form-control" id="add-post-content" rows="3" placeholder="Post content"></textarea>
                </div>
                <br>
                <button id="clear-post-button" type="submit" class="btn btn-primary mb-3"
                        onclick="document.querySelector('#add-post-id').value = 0; document.querySelector('#add-post-title').value = ''; document.querySelector('#add-post-content').value = '';">
                    Clear
                </button>
                <button id="add-post-button" type="submit" class="btn btn-primary mb-3">Submit</button>
            </form>
        </main>
    `;
}

export function PostsEvent() {
    createAddPostListener();
    createEditPostListener();
    createDeletePostListeners();
}

function createAddPostListener() {

    $("#add-post-button").click(function () {
        const id = $("#add-post-id").val();
        const title = $("#add-post-title").val();
        const content = $("#add-post-content").val();
        const newPost = {
            id,
            title,
            content
        }

        console.log("Ready to add " + newPost);

        const request = {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(newPost)
        }

        fetch("http://localhost:8081/api/posts", request)
            .then(res => {
                console.log(res.status);
                createView("/posts")
            }).catch(error => {
            console.log(error);
            createView("/posts");
        });
    });
}

function createEditPostListener() {
  $(".edit-post-button").click(function (){
      const id = $(this).data(`id`);
      const currentTitle = $(`#title-${id}`).html();
      const currentContent = $(`#content-${id}`).text();

      $("#add-post-id").val(id);
      $("#add-post-title").val(currentTitle);
      $("#add-post-content").val(currentContent);
  });
}

function createDeletePostListeners(){
    $(".delete-post-button").click(function () {
        const id = $(this).data("id");
        console.log("Delete post with the ID of " + id)

        const request = {
            method: "DELETE",
            headers: getHeaders(),
        }

        fetch(`http://localhost:8081/api/posts/${id}`, request)
            .then(res => {
                console.log(res.status);
                createView("/posts")
            }).catch(error => {
            console.log(error);
            createView("/posts");
        });

    });
}