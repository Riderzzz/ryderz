import {getHeaders} from "../auth.js";
import createView from "../createView.js";

const COMMENT_URI = "http://localhost:8081/api/comments"

export default function NewsFeed(props) {
	console.log(props)
	return `
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
				${props.posts.map(post => 
				`
				
				<div class="card m-3">
				  <div class="card-header">
					${post.author.username}
				  </div>
				  <div class="card-body">
					<h5 class="card-title">${post.title}</h5>
					<p class="card-text">${post.content}</p>
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
				
				`
				).join("")}
				</body>
			</html>`;

}

export function NewsFeedEvents() {
	commentOnPost();
	createPostBtn();
}

function commentOnPost() {
	$(".comment-btn").click(function (){
		let postId = $(this).data("id")
		const content = $('#comment-content-' + postId).val()
		console.log("Post id: " + postId)
		console.log("content: " + content)

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