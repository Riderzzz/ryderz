package com.codeup.ryderz.web;

import com.codeup.ryderz.data.*;
import com.codeup.ryderz.services.S3Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/users", headers = "Accept=application/json")
public class UsersController {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private S3Service s3Service;
    private FriendRequestRepository friendRequestRepository;


    public UsersController(UserRepository userRepository, PasswordEncoder passwordEncoder, S3Service s3Service, FriendRequestRepository friendRequestRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.s3Service = s3Service;
        this.friendRequestRepository = friendRequestRepository;
    }

    @GetMapping("me")
    private User getMyInfo(OAuth2Authentication auth){
        try{
            String userName = auth.getName();
            User usersInfo = userRepository.findByEmail(userName);

            String signedPhotoUrl = s3Service.getSignedURL(usersInfo.getProfilePicture());
            String signedHeaderUrl = s3Service.getSignedURL(usersInfo.getHeaderPicture());

            usersInfo.setUserPhotoUrl(signedPhotoUrl);
            usersInfo.setUserHeaderUrl(signedHeaderUrl);

            Collection<User> listOfFriends = usersInfo.getFriends();
            for (int i = 0; i < usersInfo.getFriends().size() ; i++) {
                User currentUser = (User) listOfFriends.toArray()[i];
                String friendsPhotoUrl = s3Service.getSignedURL(currentUser.getProfilePicture());
                currentUser.setUserPhotoUrl(friendsPhotoUrl);
            }

            Collection<Groups> listOfGroups = usersInfo.getGroupsJoined();
            for (int i = 0; i < usersInfo.getGroupsJoined().size() ; i++) {
                Groups currentUser = (Groups) listOfGroups.toArray()[i];
                String groupPhotoUrl = s3Service.getSignedURL(currentUser.getGroupImageName());
                currentUser.setGroupPhotoUrl(groupPhotoUrl);
            }

            return usersInfo;
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

        Collection<Groups> listOfGroups = usersInfo.getGroupsJoined();
        for (int i = 0; i < usersInfo.getGroupsJoined().size() ; i++) {
            Groups currentUser = (Groups) listOfGroups.toArray()[i];
            String groupPhotoUrl = s3Service.getSignedURL(currentUser.getGroupImageName());
            currentUser.setGroupPhotoUrl(groupPhotoUrl);
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

    @PutMapping("/updateAccountPassword")
    private ResponseEntity<String> updateUsersPassword(@RequestBody String passwords, OAuth2Authentication auth) {
        User user = userRepository.findByEmail(auth.getName());
        String [] passwordsArray = passwords.split(",");
        String oldPassword = passwordsArray[0];
        String newPassword = passwordsArray[1];

        if (passwordEncoder.matches(oldPassword, user.getPassword())) {
            System.out.println("updating pass");
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return new ResponseEntity<>("password updated", HttpStatus.OK);
        }
        return new ResponseEntity<>("password didnt match", HttpStatus.ACCEPTED);
    }

    @DeleteMapping("{userId}")
    private void deleteUser(@PathVariable Long userId) {
        System.out.println("ready to delete User." + userId);
    }


    @DeleteMapping("/deleteAccount/{userId}")
    private ResponseEntity<String> deleteUserAccount(@RequestBody String password, @PathVariable Long userId) {
        User user = userRepository.getById(userId);

        if (passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("passwords match");
            System.out.println("user deleted");
            return new ResponseEntity<>("user deleted", HttpStatus.OK);
        }

        return new ResponseEntity<>("Password does not match", HttpStatus.ACCEPTED);
    }

    @PostMapping("/friendRequest/{user2Id}")
    private void addFriendRequest(@PathVariable Long user2Id, OAuth2Authentication auth) {
        User sender = userRepository.findByEmail(auth.getName());
        User receiver = userRepository.getById(user2Id);
    }

    @PostMapping("/friends/{user2Id}")
    private void addFriend(@PathVariable Long user2Id, OAuth2Authentication auth){
        User sender = userRepository.findByEmail(auth.getName());
        User receiver = userRepository.getById(user2Id);

      // TODO: check to see if request already exist

      FriendRequest request = new FriendRequest();

      request.setSender(sender);
      request.setReceiver(receiver);

      friendRequestRepository.save(request);
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
