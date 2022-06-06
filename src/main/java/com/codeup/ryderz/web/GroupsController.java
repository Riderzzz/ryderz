package com.codeup.ryderz.web;


import com.codeup.ryderz.data.*;
import com.codeup.ryderz.services.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/groups", headers = "Accept=application/json")
public class GroupsController {

    @Autowired
    private S3Service service;

    private final GroupsRepository groupsRepository;
    private final UserRepository userRepository;
    private final CommentsRepository commentRepository;

    public GroupsController(GroupsRepository groupsRepository, UserRepository userRepository, CommentsRepository commentRepository) {
        this.groupsRepository = groupsRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping
    public List<Groups> getAll() {

        List<Groups> groups = groupsRepository.findAll();

        for (Groups group : groups) {
            if (group.getGroupImageName() != null) {
                String groupImageUrl = service.getSignedURL(group.getGroupImageName(), 5L);
                group.setGroupPhotoUrl(groupImageUrl);
            }
        }

        return groups;
    }

    @GetMapping("{groupId}")
    public Groups getGroupById(@PathVariable Long groupId) {
        Groups group = groupsRepository.findById(groupId).get();
        if (group.getGroupImageName() != null) {
            String groupImageUrl = service.getSignedURL(group.getGroupImageName(), 5L);
            group.setGroupPhotoUrl(groupImageUrl);
        }

        Collection<Comments> groupComments = group.getComments();

        for (Comments comment : groupComments) {
            User commentAuthor = comment.getAuthor();
            String imageName = commentAuthor.getProfilePicture();
            String imageUrl = service.getSignedURL(imageName, 5L);
            commentAuthor.setUserPhotoUrl(imageUrl);
        }

        return group;
    }

    @PostMapping
    public void createGroup(@RequestBody Groups newGroup, OAuth2Authentication auth) {
        if (auth != null) {
            String email = auth.getName();
            User user = userRepository.findByEmail(email);
            newGroup.setGroupOwner(user);
            List<User> users = new ArrayList<>();
            users.add(user);
            newGroup.setUsers(users);
        }

        groupsRepository.save(newGroup);
        System.out.println("Group Created");

    }

    @PutMapping("{groupId}")
    public void editGroup(@PathVariable Long groupId, @RequestBody Groups newGroup) {
        Groups groupToUpdate = groupsRepository.getById(groupId);

        groupToUpdate.setName(newGroup.getName());
        groupToUpdate.setBio(newGroup.getBio());
        groupToUpdate.setLocation(newGroup.getLocation());

        groupsRepository.save(groupToUpdate);
    }

    @PostMapping("{groupId}/groupUpload")
    public ResponseEntity<String> uploadFile(@PathVariable Long groupId, @RequestParam(value = "file") MultipartFile file) {
        Groups group = groupsRepository.findById(groupId).get();
//        delete previous image if exists
        if (group.getGroupImageName() != null) {
            String previousImgName = group.getGroupImageName();
            service.deleteFile(previousImgName);
        }
        System.out.println(file);
        String fileName = service.uploadFile(file);
        group.setGroupImageName(fileName);
        groupsRepository.save(group);
        return new ResponseEntity<>(fileName, HttpStatus.OK);
    }

    @PutMapping("{addGroupId}/adduser")
    public void addUserToGroup(@PathVariable Long addGroupId, OAuth2Authentication auth) {
        User userToJoin = userRepository.findByEmail(auth.getName());
        Groups groupToJoin = groupsRepository.getById(addGroupId);

        List<User> groupsUsers = groupToJoin.getUsers();

        groupsUsers.add(userToJoin);

        groupToJoin.setUsers(groupsUsers);

        groupsRepository.save(groupToJoin);
    }

    @DeleteMapping("{groupId}/remove-user")
    public void removeUserFromGroup(@PathVariable Long groupId, OAuth2Authentication auth) {
        User userToRemove = userRepository.findByEmail(auth.getName());
        Groups group = groupsRepository.getById(groupId);

        List<User> users = group.getUsers();

        users.remove(userToRemove);

        group.setUsers(users);

        groupsRepository.save(group);
    }

    @DeleteMapping("{groupId}")
//    Todo:if users in group delete them from group_users table before deleting group
    public void deleteGroup(@PathVariable Long groupId) {
        Groups group = groupsRepository.getById(groupId);
        if (group.getGroupImageName() != null) {
            String previousImgName = group.getGroupImageName();
            service.deleteFile(previousImgName);
        }
        group.setUsers(null);
        Collection<Comments> comments = group.getComments();
        commentRepository.deleteAll(comments);
        groupsRepository.deleteById(groupId);
    }

    @GetMapping("recentGroups")
    public Collection<Groups> getRecentGroups() {
        List<Groups> allGroups = groupsRepository.findAll();

        List<Groups> recentThree = new ArrayList<>();

        recentThree.add(allGroups.get(allGroups.size() - 1));
        recentThree.add(allGroups.get(allGroups.size() - 2));
        recentThree.add(allGroups.get(allGroups.size() - 3));

        for (Groups group : recentThree) {
            String groupPhotoName = group.getGroupImageName();
            String signedUrl = service.getSignedURL(groupPhotoName, 5L);
            group.setGroupPhotoUrl(signedUrl);
        }

        return recentThree;
    }
}
