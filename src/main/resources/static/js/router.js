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
            title: 'Home',
        },
        '/login': {
            returnView: Login,
            state: {},
            uri: '/login',
            title: "Login",
            viewEvent: LoginEvent
        },
        '/register': {
            returnView: Register,
            state: {},
            uri: '/register',
            title: 'Register',
            viewEvent: RegisterEvent
        },
        '/posts': {
            returnView: PostIndex,
            state: {
                posts: '/api/posts'
            },
            uri: '/posts',
            title: 'All Posts',
            viewEvent: PostsEvent
        },
        '/about': {
            returnView: About,
            state: {},
            uri: '/about',
            title: 'About',
        },
        '/error': {
            returnView: Error404,
            state: {},
            uri: location.pathname,
            title: ' ERROR',
        },
        '/loading': {
            returnView: Loading,
            state: {},
            uri: location.pathname,
            title: 'Loading...',
        },
        '/user': {
            returnView: User,
            state: {
                user: "/api/users/me"
            },
            uri: '/user',
            title: 'User',
            viewEvent: UserEvent
        },
        '/logout': {
            returnView: logOut,
            state: {},
            uri: location.pathname,
            title: 'Log Out',
            viewEvent: LogOutEvent
        },
        '/newsfeed': {
            returnView: NewsFeed,
            uri: '/newsfeed',
            state: {
                posts: "/api/posts/friendsPost",
                user: "/api/users/me"
            },
            title: 'News Feed',
            viewEvent: NewsFeedEvents
        },
        '/discover': {
            returnView: Discover,
            uri: '/discover',
            state: {
                events:"/api/events",
                groups: "/api/groups"
            },
            title: 'Discover',
            viewEvent: DiscoverEvents
        },
        '/event': {
            returnView: Event,
            uri: '/event',
            state: {
                event: `/api/events/${Id}`
            },
            viewEvent: EventEvents
        },
        '/group': {
            returnView: Group,
            uri: '/group',
            state: {
                group: `/api/groups/${Id}`
            },
            viewEvent: GroupEvents
        },
        '/createGroup': {
            returnView: CreateGroup,
            uri: '/createGroup',
            state: {},
            viewEvent: CreateGroupEvents
        },
        '/createEvent': {
            returnView: CreateEvent,
            uri: '/createGroup',
            state: {
                categories: "/api/categories/all"
            },
            viewEvent: CreateEventEvents
        },
        '/createPost': {
            returnView: CreatePost,
            uri: '/createPost',
            state: {
                categories: "/api/categories/all"
            },
            viewEvent: CreatePostEvents
        },
        '/editPost': {
            returnView: EditPost,
            uri: '/editPost',
            state : {
                posts: '/api/posts',
                categories: "/api/categories/all"
            },
            viewEvent: EditPostEvents
        }, '/profile': {
            returnView: Profile,
            uri: '/profile',
            state : {
                profile: `/api/users/${Id}`
            },
            viewEvent: showFriendsProfile
        },

    };

    return routes[URI];
}

