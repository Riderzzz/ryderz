import {getHeaders} from "../auth.js";
import createView from "../createView.js";

const POST_URI = `${URI}/api/posts`

export default function CreatePost(props) {
    return `
			<!DOCTYPE html>
			<html lang="html">
				<head>
					<meta charset="UTF-8"/>
					<title>Create Post</title>
				</head>
				<body>
                    <form class="m-3">
                        <div class="mb-3">
                          <label for="createPostTitle" class="form-label">Title</label>
                          <input type="email" class="form-control" id="createPostTitle">
                        </div>
                        <div class="mb-3">
                          <label for="createPostContent" class="form-label">Content</label>
                          <textarea class="form-control" id="createPostContent" rows="3"></textarea>
                        </div>
                        <div class="mb-3">
                         ${props.categories.map(cat =>
                             `
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" id="category-${cat.id}" value="${cat.name}">
                                    <label class="form-check-label" for="category-${cat.id}">${cat.name}</label>
                                </div>
                            `)
                            .join('')}
                        </div>
                        <div class="mb-3 d-flex justify-content-end">
                            <button class="btn btn-dark create-post-btn mx-4">Create Post</button>
                        </div>
                    </form>
				</body>
				`
}

export function CreatePostEvents(){
    createPostListener();
}

function createPostListener() {
    $('.create-post-btn').click(e => {

        let selectedCategories = [];

        $('input[type="checkbox"]:checked').each(function() {
            selectedCategories.push({name: this.value})

        });


        const title = $('#createPostTitle').val();
        const content = $('#createPostContent').val();
        const categories = selectedCategories;

        const postObject = {
            title,
            content,
            categories
        }
        const requestObject = {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(postObject)
        }

        fetch(POST_URI, requestObject).then(r => {
            console.log("post created")
        }).catch(r => {
            console.log('error')
        }).finally(r => {
            createView('/newsfeed')
        })
    })
}