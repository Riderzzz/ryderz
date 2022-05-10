import createView from "../createView.js";

export default function Profile(props){
console.log(props)
// language=HTML
    return `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>${props.profile.username}</title>
    </head>
    <body>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1>${props.profile.username}</h1>
            </div>
        </div>
    </div>
    </body>
    </html>`;
}
export function showFriendsProfile(){

}