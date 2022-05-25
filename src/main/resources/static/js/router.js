import Home from "./views/Home.js";
import PostIndex from "./views/PostIndex.js";
import About from "./views/About.js";
import Error404 from "./views/Error404.js";
import Loading from "./views/Loading.js";
import Login from "./views/Login.js";
import LoginEvent from "./auth.js";
import Register from "./views/Register.js"
import {RegisterEvent} from "./views/Register.js";
import {PostsEvent} from "./views/PostIndex.js";
import {UserEvent} from "./views/User.js";
import User from "./views/User.js";
import logOut from "./views/logOut.js";
import {LogOutEvent} from "./views/logOut.js";
import NewsFeed, {NewsFeedEvents} from "./views/NewsFeed.js";
import Discover, {DiscoverEvents} from "./views/Discover.js";
import Event, {EventEvents} from "./views/Event.js";
import Group, {GroupEvents} from "./views/Group.js";
import CreateGroup, {CreateGroupEvents} from "./views/CreateGroup.js";
import CreateEvent, {CreateEventEvents} from "./views/CreateEvent.js";
import CreatePost, {CreatePostEvents} from "./views/CreatePost.js";
import EditPost, {EditPostEvents} from "./views/EditPost.js";
import Profile, {showFriendsProfile} from "./views/Profile.js";



import chatTest, {chatTestEvents} from "./views/chat.js";

/**
 * Returns the route object for a specific route based on the given URI
 * @param URI
 * @returns {*}
 */
export default function router(URI, Id) {
    const routes = {
        '/': {
            returnView: Home,
            state: {},
            uri: '/',
            title: 'Home'
        },
        '/login': {
            returnView: Login,
            state: {},
            title: 'Login',
            uri: '/login',
            viewEvent: LoginEvent
        },
        '/register': {
            returnView: Register,
            state: {},
            title: 'Register',
            uri: '/register',
            viewEvent: RegisterEvent
        },
        '/posts': {
            returnView: PostIndex,
            state: {
                posts: '/api/posts'
            },
            title: 'Post Index',
            uri: '/posts',
            viewEvent: PostsEvent
        },
        '/about': {
            returnView: About,
            state: {},
            uri: '/about',
            title: 'About'
        },
        '/error': {
            returnView: Error404,
            state: {},
            uri: location.pathname,
            title: ' ERROR',
        },
        '/loading': {
            returnView: Loading,
            title: 'Loading',
            state: {},
            uri: location.pathname,
        },
        '/user': {
            returnView: User,
            state: {
                user: "/api/users/me"
            },
            title: 'User',
            uri: '/user',
            viewEvent: UserEvent
        },
        '/logout': {
            returnView: logOut,
            state: {},
            uri: location.pathname,
            viewEvent: LogOutEvent
        },
        '/newsfeed': {
            returnView: NewsFeed,
            uri: '/newsfeed',
            title: 'News Feed',
            state: {
                posts: "/api/posts/friendsPost",
                events: "/api/events/friendsEvents",
                user: "/api/users/me",
                categories: "/api/categories/all"
            },
            viewEvent: NewsFeedEvents
        },
        '/discover': {
            returnView: Discover,
            uri: '/discover',
            title: 'Discover',
            state: {
                events: "/api/events",
                groups: "/api/groups"
            },
            viewEvent: DiscoverEvents
        },
        '/event': {
            returnView: Event,
            uri: `/event/${Id}`,
            title: 'Event',
            state: {
                event: `/api/events/${Id}`
            },
            viewEvent: EventEvents
        },
        '/group': {
            returnView: Group,
            uri: `/group/${Id}`,
            title: 'Group',
            state: {
                group: `/api/groups/${Id}`
            },
            viewEvent: GroupEvents
        },
        '/createGroup': {
            returnView: CreateGroup,
            uri: '/createGroup',
            title: 'Create Group',
            state: {},
            viewEvent: CreateGroupEvents
        },
        '/createEvent': {
            returnView: CreateEvent,
            uri: '/createGroup',
            title: 'Create Event',
            state: {
                categories: "/api/categories/all"
            },
            viewEvent: CreateEventEvents
        },
        '/createPost': {
            returnView: CreatePost,
            uri: '/createPost',
            title: 'Create Post',
            state: {
                categories: "/api/categories/all"
            },
            viewEvent: CreatePostEvents
        },
        '/editPost': {
            returnView: EditPost,
            uri: '/editPost',
            title: 'Edit Post',
            state: {
                posts: '/api/posts',
                categories: "/api/categories/all"
            },
            viewEvent: EditPostEvents
        },
        '/profile': {
            returnView: Profile,
            uri: `/profile/${Id}`,
            title: 'Profile',
            state : {
                profile: `/api/users/${Id}`
            },
            viewEvent: showFriendsProfile
        },
        '/chatTest': {
            returnView: chatTest,
            uri: '/chatTest',
            state: {},
            title: 'Chat',
            viewEvent: chatTestEvents
        }
    };

    return routes[URI];
}

