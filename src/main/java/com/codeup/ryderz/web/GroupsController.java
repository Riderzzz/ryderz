package com.codeup.ryderz.web;


import com.codeup.ryderz.data.Groups;
import com.codeup.ryderz.data.GroupsRepository;
import com.codeup.ryderz.data.User;
import com.codeup.ryderz.data.UserRepository;
import com.codeup.ryderz.services.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/groups", headers = "Accept=application/json")
public class GroupsController {

    @Autowired
    private S3Service service;

    private final GroupsRepository groupsRepository;
    private final UserRepository userRepository;

    public GroupsController(GroupsRepository groupsRepository, UserRepository userRepository) {
        this.groupsRepository = groupsRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Groups> getAll() {
        return groupsRepository.findAll();
    }

    @GetMapping("{groupId}")
    public Groups getGroupById(@PathVariable Long groupId) {
        Groups group = groupsRepository.findById(groupId).get();
        String groupImageUrl = service.getSignedURL(group.getGroupImageName());
        group.setGroupPhotoUrl(groupImageUrl);
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

//    TODO: Check if image exists to delete old image before adding a new image
    @PostMapping("{groupId}/upload")
    public ResponseEntity<String> uploadFile(@PathVariable Long groupId, @RequestParam(value = "file") MultipartFile file) {
        Groups group = groupsRepository.findById(groupId).get();
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
        group.setUsers(null);
        groupsRepository.save(group);
        groupsRepository.deleteById(groupId);
    }
}
