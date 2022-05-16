package com.codeup.ryderz.web;

import com.codeup.ryderz.data.*;
import com.codeup.ryderz.services.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping(value = "/api/posts", headers = "Accept=application/json")
public class PostController {
    private final PostsRepository postRepository;
    private final UserRepository userRepository;
    private final CategoriesRepository categoriesRepository;
    private final CommentsRepository commentsRepository;
    private final EmailService emailService;

    @GetMapping
    private List<Post> getAll() {
        return postRepository.findAll();
    }

    @GetMapping("{postId}")
    private Optional<Post> getById(@PathVariable Long postId) {
        return postRepository.findById(postId);
    }

    @PostMapping
    private void createPost(@RequestBody Post newPost, OAuth2Authentication auth) {
        String email = auth.getName();
        User author = userRepository.findByEmail(email);
        newPost.setAuthor(author);

        Collection<Category> categories = new ArrayList<>();

        for (Category category : newPost.getCategories()) {
            System.out.println(category.getName());
            categories.add(categoriesRepository.findByName(category.getName()));
        }

        newPost.setCategories(categories);


        postRepository.save(newPost);
    }
//get email address of currently logged-in user, get user object with that email address. then compare user
//ID and author of the post.
    @PutMapping("{postId}")
    private void updatePost(@PathVariable Long postId, @RequestBody Post newPost, OAuth2Authentication auth) {
        System.out.printf("Backend wants to update post id %d with %s\n", postId, newPost);

        /*
            initializing and empty array of categories. loops through the categories array sent through the
            request body and checks to see if the name matches the categories name in the database. if it does
            it adds the actual category to the array list to be set to the post
         */
        Collection<Category> categories = new ArrayList<>();

        for (Category category : newPost.getCategories()) {
            System.out.println(category.getName());
            categories.add(categoriesRepository.findByName(category.getName()));
        }

        newPost.setCategories(categories);

        Post originalPost = postRepository.getById(postId);
        BeanUtils.copyProperties(newPost, originalPost, getNullPropertyNames(newPost));
        postRepository.save(originalPost);
    }

    @DeleteMapping("{postId}")
    private void deletePost(@PathVariable Long postId) {
        System.out.printf("Backend wants to delete post id %d\n", postId);
        Post postToDelete = postRepository.getById(postId);

        //in order to delete a post with comments you must first delete those comments from the database
        Collection<Comments> postsComments = postToDelete.getComments();

        for (Comments comment : postsComments) {
            commentsRepository.deleteById(comment.getId());
        }
        postRepository.deleteById(postId);
    }

    private static String[] getNullPropertyNames(Object source) {
        final BeanWrapper src = new BeanWrapperImpl(source);
        java.beans.PropertyDescriptor[] pds = src.getPropertyDescriptors();

        Set<String> emptyNames = new HashSet<String>();
        for (java.beans.PropertyDescriptor pd : pds) {
            Object srcValue = src.getPropertyValue(pd.getName());
            if (srcValue == null) emptyNames.add(pd.getName());
        }

        String[] result = new String[emptyNames.size()];
        return emptyNames.toArray(result);
    }

    @GetMapping("friendsPost")
    public Collection<Post> getNewsfeedPosts(OAuth2Authentication auth) {
        User mainUser = userRepository.findByEmail(auth.getName());

        Collection<User> userFriends = mainUser.getFriends();
        List<Post> usersFriendsPost = new ArrayList<>();


        usersFriendsPost.addAll(postRepository.findPostByAuthor_Username(mainUser.getUsername()));

        for (User friend : userFriends) {
            usersFriendsPost.addAll(postRepository.findPostByAuthor_Username(friend.getUsername()));
        }

        Collections.sort(usersFriendsPost);

        return usersFriendsPost;
    }



}
