package com.codeup.ryderz.web;

import com.codeup.ryderz.data.*;
import com.codeup.ryderz.services.S3Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    private FriendsRepository friendsRepository;


    public UsersController(UserRepository userRepository, PasswordEncoder passwordEncoder, S3Service s3Service, FriendRequestRepository friendRequestRepository, FriendsRepository friendsRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.s3Service = s3Service;
        this.friendRequestRepository = friendRequestRepository;
        this.friendsRepository = friendsRepository;
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

        for (int i = 0; i < usersInfo.getPosts().size(); i++) {
            Post currentPost = (Post) usersInfo.getPosts().toArray()[i];
            Collection<Comments> postComments = currentPost.getComments();
            for (int j = 0; j <postComments.size() ; j++) {
                Comments comment = (Comments) postComments.toArray()[j];
                String commentAuthorUrl = s3Service.getSignedURL(comment.getAuthor().getProfilePicture());
                comment.getAuthor().setUserPhotoUrl(commentAuthorUrl);
            }
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

    @GetMapping("/friendRequest")
    private Collection<FriendRequest> getFriendsRequests(OAuth2Authentication auth) {
        User receiver = userRepository.findByEmail(auth.getName());
        Collection<FriendRequest> getAllUsersFriendsRequests = receiver.getFriendsRequest();
        return getAllUsersFriendsRequests;

    }

    @PostMapping("/friends/{user2Id}")
    private void sendFriendRequest(@PathVariable Long user2Id, OAuth2Authentication auth){
        User sender = userRepository.findByEmail(auth.getName());
        User receiver = userRepository.getById(user2Id);

        // TODO: check to see if request already exist
        FriendRequest existingFriendRequest = friendRequestRepository.getFriendsRequest(sender.getId(), receiver.getId());
        System.out.println(existingFriendRequest);
        if(existingFriendRequest == null){

            FriendRequest request = new FriendRequest();

            request.setSender(sender);
            request.setReceiver(receiver);

            friendRequestRepository.save(request);
        }

    }

    @DeleteMapping("/friendRequest/{user2id}")
    private void deleteFriendsRequest(@PathVariable Long user2id, OAuth2Authentication auth){
        User sender = userRepository.findByEmail(auth.getName());
        User receiver = userRepository.getById(user2id);

        friendRequestRepository.deleteFriendsRequest(sender.getId(), receiver.getId());
    }

    @DeleteMapping("/friends/{user2Id}")
    private void deleteFriend(@PathVariable Long user2Id, OAuth2Authentication auth){
        User friend1 = userRepository.findByEmail(auth.getName());
        User friend2 = userRepository.getById(user2Id);

        friendsRepository.deleteFriends(friend1.getId(), friend2.getId());
        friendsRepository.deleteFriends(friend2.getId(), friend1.getId());

    }


    @PostMapping("/addfriend/{addFriend}")
    private void addFriend(@PathVariable Long addFriend, OAuth2Authentication auth) {
        User receiver = userRepository.findByEmail(auth.getName());
        User sender = userRepository.getById(addFriend);

        Friends newFriend = new Friends();

        newFriend.setUserOne(sender);
        newFriend.setUserTwo(receiver);

        friendsRepository.save(newFriend);

        Friends secondFriend = new Friends();

        secondFriend.setUserTwo(sender);
        secondFriend.setUserOne(receiver);

        friendsRepository.save(secondFriend);

        friendRequestRepository.deleteFriendsRequest(sender.getId(), receiver.getId());
    }

    @PostMapping("/changeAvatar/{userId}")
    public ResponseEntity<String> uploadAvatarFile(@PathVariable Long userId, @RequestParam(value = "file") MultipartFile file) {
//        Groups group = groupsRepository.findById(groupId).get();

        User user = userRepository.getById(userId);
//        delete previous image if exists
        if (user.getProfilePicture() != null) {
            String previousImgName = user.getProfilePicture();
            s3Service.deleteFile(previousImgName);
        }
        System.out.println(file);
        String fileName = s3Service.uploadFile(file);
        user.setProfilePicture(fileName);
        userRepository.save(user);
        return new ResponseEntity<>(fileName, HttpStatus.OK);
    }

    @PostMapping("/changeHeader/{userId}")
    public ResponseEntity<String> uploadHeaderFile(@PathVariable Long userId, @RequestParam(value = "file") MultipartFile file) {
//        Groups group = groupsRepository.findById(groupId).get();

        User user = userRepository.getById(userId);
//        delete previous image if exists
        if (user.getHeaderPicture() != null) {
            String previousImgName = user.getHeaderPicture();
            s3Service.deleteFile(previousImgName);
        }
        System.out.println(file);
        String fileName = s3Service.uploadFile(file);
        user.setHeaderPicture(fileName);
        userRepository.save(user);
        return new ResponseEntity<>(fileName, HttpStatus.OK);
    }

}
