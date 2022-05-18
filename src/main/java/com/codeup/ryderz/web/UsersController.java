package com.codeup.ryderz.web;

import com.codeup.ryderz.data.User;
import com.codeup.ryderz.data.UserRepository;
import com.codeup.ryderz.services.S3Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Size;
import javax.websocket.server.PathParam;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/users", headers = "Accept=application/json")
public class UsersController {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private S3Service s3Service;

    public UsersController(UserRepository userRepository, PasswordEncoder passwordEncoder, S3Service s3Service) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.s3Service = s3Service;
    }

    @GetMapping("me")
    private User getMyInfo(OAuth2Authentication auth){
        try{
            String userName = auth.getName();
            return userRepository.findByEmail(userName);
        }catch (NullPointerException e) {
            return userRepository.findByEmail("temp@temp.com");
        }
    }
    @GetMapping
    private List<User> getUser() {
        return userRepository.findAll();
    }

//    TODO: upload image file.
//    upload user image
//    receive file from front end
//    If user !image upload file
//    s3Service.deleteFile
//    else --> delete current image --> upload new image



    @GetMapping("{userID}")
    public User getUserById(@PathVariable Long userID) {
        User usersInfo = userRepository.findById(userID).get();
        String usersPhotoUrl = s3Service.getSignedURL(usersInfo.getProfilePicture());
        String usersHeaderUrl = s3Service.getSignedURL(usersInfo.getHeaderPicture());
        usersInfo.setUserHeaderUrl(usersHeaderUrl);
        usersInfo.setUserPhotoUrl(usersPhotoUrl);

        Collection<User> listOfFriends = usersInfo.getFriends();
        for (int i = 0; i < usersInfo.getFriends().size() ; i++) {
            User currentUser = (User) listOfFriends.toArray()[i];
            String friendsPhotoUrl = s3Service.getSignedURL(currentUser.getProfilePicture());
            currentUser.setUserPhotoUrl(friendsPhotoUrl);
        }

        return usersInfo;
    }

    @GetMapping("/getByUsername")
    public User getByUsername(@RequestParam String username) {
        return userRepository.findByUsername(username);
    }

    @GetMapping("/getByEmail")
    public User getByEmail(@RequestParam String email) {
        return userRepository.findByUsername(email);
    }

    @PostMapping
    private void createUser(@RequestBody User newUser) {
        User user = newUser;

        user.setCreatedAt(LocalDate.now());
        user.setRole(User.Role.USER);
        user.setPassword(passwordEncoder.encode(newUser.getPassword()));

        System.out.println("Ready to add user." + newUser);

        userRepository.save(user);
    }

    @PutMapping("{id}")
    private void updateUser(@PathVariable Long id, @RequestBody User newUser) {
        User originalUser = userRepository.getById(id);
        originalUser.setEmail(newUser.getEmail());
        originalUser.setUsername(newUser.getUsername());
        userRepository.save(originalUser);
        System.out.println("User updated!");
    }

    @PutMapping("{id}/updatePassword")
    private void updatePassword(@PathVariable Long id, @RequestParam(required = false) String oldPassword, @Valid @Size(min = 3) @RequestParam String newPassword, OAuth2Authentication auth) {
        User originalUser = userRepository.findByEmail(auth.getName());
        originalUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(originalUser);
        System.out.println("changing password to " + newPassword);
    }

    @DeleteMapping("{userId}")
    private void deleteUser(@PathVariable Long userId) {
        System.out.println("ready to delete User." + userId);
    }

    @PostMapping("{user1Id}/friends/{user2Id}")
    private void addFriend(@PathVariable User user1Id, @PathVariable Long user2Id){
        User user1 = user1Id;
        User user2 = userRepository.getById(user2Id);

        user2.setFriends(new ArrayList<>());
        user1.setFriends(new ArrayList<>());

        user1.getFriends().add(user2);
        user2.getFriends().add(user1);

        userRepository.save(user1);
        userRepository.save(user2);
    }

    @DeleteMapping("{user1Id}/friends/{user2Id}")
    private void deleteFriend(@PathVariable User user1Id, @PathVariable Long user2Id){
        User user1 = user1Id;
        User user2 = userRepository.getById(user2Id);

        user1.getFriends().remove(user2);
        user2.getFriends().remove(user1);

        userRepository.save(user1);
        userRepository.save(user2);
    }

}
