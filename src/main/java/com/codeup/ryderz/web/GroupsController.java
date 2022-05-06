package com.codeup.ryderz.web;


import com.codeup.ryderz.data.Groups;
import com.codeup.ryderz.data.GroupsRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/groups", headers = "Accept=application/json")
public class GroupsController {

    private final GroupsRepository groupsRepository;

    public GroupsController(GroupsRepository groupsRepository) {
        this.groupsRepository = groupsRepository;
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
}
