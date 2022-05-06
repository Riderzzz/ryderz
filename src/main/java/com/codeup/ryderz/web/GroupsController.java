package com.codeup.ryderz.web;


import com.codeup.ryderz.data.Groups;
import com.codeup.ryderz.data.GroupsRepository;
import com.codeup.ryderz.data.User;
import com.codeup.ryderz.data.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

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

    @PostMapping
    public void createGroup(@RequestBody Groups newGroup) {
        Groups groupToAdd = new Groups();

        groupToAdd.setGroupOwner(newGroup.getGroupOwner());
        groupToAdd.setName(newGroup.getName());
        groupToAdd.setBio(newGroup.getBio());
        groupToAdd.setLocation(newGroup.getLocation());

        groupToAdd.setCreateDate(LocalDate.now());

        groupsRepository.save(groupToAdd);
    }

    @PutMapping("{groupId}")
    public void editGroup(@PathVariable Long groupId, @RequestBody Groups newGroup) {
        Groups groupToUpdate = groupsRepository.getById(groupId);

        groupToUpdate.setName(newGroup.getName());
        groupToUpdate.setBio(newGroup.getBio());
        groupToUpdate.setLocation(newGroup.getLocation());

        groupsRepository.save(groupToUpdate);
    }

    @PutMapping("{groupId}")
    public void addUserToGroup (@PathVariable Long groupId, @RequestParam Long userId) {
        User userJoiningGroup = userRepository.getById(userId);
        Groups groupToJoin = groupsRepository.getById(groupId);

        List<User> groupsUsers = groupToJoin.getUsers();

        groupsUsers.add(userJoiningGroup);

        groupToJoin.setUsers(groupsUsers);

        groupsRepository.save(groupToJoin);
    }

    @DeleteMapping("{groupId}")
    public void deleteGroup(@PathVariable Long groupId) {
        groupsRepository.deleteById(groupId);
    }
}
