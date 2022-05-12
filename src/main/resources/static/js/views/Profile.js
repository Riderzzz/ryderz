import createView from "../createView.js";

export default function Profile(props){
console.log(props)














    // **DO THIS**:
//   Replace BUCKET_NAME with the bucket name.
//
    var albumBucketName = 'rydzerzcollection';

// **DO THIS**:
//   Replace this block of code with the sample code located at:
//   Cognito -- Manage Identity Pools -- [identity_pool_name] -- Sample Code -- JavaScript
//
// Initialize the Amazon Cognito credentials provider
    AWS.config.region = 'us-east-2'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:466d1735-6b07-4cd6-b7da-1009316263c8',
    });

// Create a new service object
    var s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {Bucket: albumBucketName}
    });
















// language=HTML
    return `<!DOCTYPE html>
    <html lang="html">
    <head>
        <meta charset="UTF-8"/>
        <title>${props.profile.username}</title>
    </head>
    <body>
    <div class="picture-header">
        <img src="${props.profile.profilePicture}">
    </div>
    <div class="container">
        <div class="row">
            <div class="col">
                
            </div>
        </div>
    </div>
    </body>
    </html>`;
}
export function showFriendsProfile(){

}