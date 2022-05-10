import {getHeaders} from "../auth.js";
import createView from "../createView.js";
import {editPostCategories, editPostContent, editPostId, editPostTitle} from "./NewsFeed.js";

const POST_URI = 'http://localhost:8081/api/posts'

export default function EditPost(props) {
    console.log(props)
    return `
			<!DOCTYPE html>
			<html lang="html">
				<head>
					<meta charset="UTF-8"/>
					<title>Edit Post</title>
				</head>
				<body>
                    <form class="m-3">
                        <div class="mb-3">
                          <label for="editPostTitle" class="form-label">Title</label>
                          <input type="email" class="form-control" id="editPostTitle" value="${editPostTitle}">
                        </div>
                        <div class="mb-3">
                          <label for="editPostContent" class="form-label">Content</label>
                          <textarea class="form-control" id="editPostContent" rows="3">${editPostContent}</textarea>
                        </div>
                        <div class="mb-3">
                         ${props.categories.map(cat => {
                            let categoriesHtml = `
                                <div class="form-check form-check-inline">
                                                 `;
                            
                            if(editPostCategories.includes(cat.name)){
                            categoriesHtml += `<input class="form-check-input" type="checkbox" id="category-${cat.id}" value="${cat.name}" checked>`
                            } else {
                                categoriesHtml += `<input class="form-check-input" type="checkbox" id="category-${cat.id}" value="${cat.name}">`
                            }
                            categoriesHtml += `
                                    <label class="form-check-label" for="category-${cat.id}">${cat.name}</label>
                                </div>
                            `
                            return categoriesHtml;
                            })
                            .join('')}
                        </div>
                        <div class="mb-3 d-flex justify-content-end">
                            <button class="btn btn-dark edit-post-btn mx-4">edit Post</button>
                        </div>
                    </form>
				</body>
				`
}

export function EditPostEvents(){
    editPostListener();
}

function editPostListener() {
    $('.edit-post-btn').click(e => {

        let selectedCategories = [];

        $('input[type="checkbox"]:checked').each(function() {
            selectedCategories.push({name: this.value})

        });

        // console.log(selectedCategories)

        const title = $('#editPostTitle').val();
        const content = $('#editPostContent').val();
        const categories = selectedCategories;

        const postObject = {
            title,
            content,
            categories
        }
        console.log(postObject);
        const requestObject = {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(postObject)
        }

        fetch(`${POST_URI}/${editPostId}`, requestObject).then(r => {
            console.log("post edited")
        }).catch(r => {
            console.log('error')
        }).finally(r => {
            createView('/newsfeed')
        })
    })
}