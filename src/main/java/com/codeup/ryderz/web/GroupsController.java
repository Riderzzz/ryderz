package com.codeup.ryderz.web;


import com.codeup.ryderz.data.Groups;
import com.codeup.ryderz.data.GroupsRepository;
import com.codeup.ryderz.data.User;
import com.codeup.ryderz.data.UserRepository;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/groups", headers = "Accept=application/json")
public class GroupsController {

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
    public Optional<Groups> getGroupById(@PathVariable Long groupId) {
        return groupsRepository.findById(groupId);
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

    @PutMapping("{addGroupId}/adduser")
    public void addUserToGroup(@PathVariable Long addGroupId, @RequestParam Long userId) {
        User userJoiningGroup = userRepository.getById(userId);
        Groups groupToJoin = groupsRepository.getById(addGroupId);

        List<User> groupsUsers = groupToJoin.getUsers();

        groupsUsers.add(userJoiningGroup);

        groupToJoin.setUsers(groupsUsers);

        groupsRepository.save(groupToJoin);
    }

    @DeleteMapping("{groupId}/removeUser")
    public void removeUserFromGroup(@PathVariable Long groupId, @RequestParam Long userId) {
        User userToRemove = userRepository.getById(userId);
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
