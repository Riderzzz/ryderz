import {getHeaders, isLoggedIn, userEmail} from "../auth.js";
import createView from "../createView.js";

const COMMENT_URI = "http://localhost:8081/api/comments";
const POST_URI = "http://localhost:8081/api/posts";

export let editPostId;
export let editPostTitle;
export let editPostContent;
export let editPostCategories;

export default function NewsFeed(props) {
	console.log(props)
	let html = `
			<!DOCTYPE html>
			<html lang="html">
				<head>
					<meta charset="UTF-8"/>
					<title>News Feed</title>
				</head>
				<body>
				<header class="d-flex justify-content-between m-3">
					<div class="mx-4"><h3>News Feed</h3></div>
					<button class="btn btn-dark create-post-btn mx-4">Create Post</button>
				</header>
				
				
				
				`;

	html = html + props.posts.map(post => {
				let postHtml =  `
				
					<div class="card m-3">
				 	 <div class="card-header d-flex justify-content-between">
				 	 	<div>
							${post.author.username}
						</div>
				 	 	<div class="edit-delete">
				`
				if (userEmail() === post.author.email) {
					postHtml = postHtml + `<i data-id="${post.id}" class="bi bi-pen post-edit-btn mx-1"></i><i data-id="${post.id}" class="bi bi-x-lg post-delete-btn ml-1"></i>`
				}

				postHtml = postHtml +
					`
				  			
				 	 	</div>
				 	 </div>
				  	
				  <div class="card-body">
					<h5 class="card-title" id="post-title-${post.id}">${post.title}</h5>
					<p class="card-text" id="post-content-${post.id}">${post.content}</p>
					<p class="card-text" id="post-categories-${post.id}">${post.categories.map(category => `${category.name}`).join(" ")}</p>
					<p>
						<button class="btn btn-dark" type="button" data-bs-toggle="collapse" data-bs-target="#post-${post.id}-collapseComments" aria-expanded="false" aria-controls="post-${post.id}-collapseComments">
							Comments
						</button>
					</p>
					
					
					<div class="collapse" id="post-${post.id}-collapseComments">
						<div class="input-group mb-3">
						  <input type="text" id="comment-content-${post.id}" class="form-control" data-postId="${post.id}" placeholder="Your thoughts..." aria-label="Comment" aria-describedby="button-addon-${post.id}">
						  <button class="btn btn-outline-secondary comment-btn" data-id="${post.id}" type="button" id="button-addon-${post.id}">comment</button>
						</div>
					${post.comments.map(comment =>
						`
						
						  <div class="card card-body">
						  author: ${comment.author.username}  content: ${comment.content}
						  </div>
						
						`).join("")}
					</div>
				  </div>
				</div>		
				</div>
				</section>
				</body>
				</html>`

		return postHtml;
	}).join("");

	return html;
}

export function NewsFeedEvents() {
	commentOnPost();
	createPostBtn();
	editPostBtn();
	deletePostBtn();
}

function commentOnPost() {
	$(".comment-btn").click(function (){
		let postId = $(this).data("id")
		const content = $('#comment-content-' + postId).val()

		//author field gets set in backend
		const commentObject = {
			content,
			post: {
				id: postId
			}
		}

		console.log(commentObject)

		const requestObject = {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify(commentObject)
		}

		fetch(COMMENT_URI, requestObject).then(function (){
			console.log("Comment created");
		}).catch(function (){
			console.log("error")
		}).finally(function (){
			createView("/newsfeed")
		});
	});
}

function createPostBtn() {
	$(".create-post-btn").click(function (){
		createView('/createPost')
	})
}

function editPostBtn() {
	$(".post-edit-btn").click(function (){
		editPostId = $(this).data("id");
		editPostTitle = $('#post-title-' + editPostId).text();
		editPostContent = $('#post-content-' + editPostId).text();
		editPostCategories = $('#post-categories-' + editPostId).text();
		editPostCategories = editPostCategories.split(" ");

		createView('/editPost')
	});
}

function deletePostBtn() {
	$(".post-delete-btn").click(function (){
		const postId = $(this).data("id")

		const requestObject = {
			method: "DELETE",
			headers: getHeaders()
		}

		fetch(`${POST_URI}/${postId}`, requestObject).then(r => {
			console.log("Post deleted")
		}).catch(r => {
			console.log("error")
		}).finally(() => {
			createView("/newsfeed")
		})
	});
}