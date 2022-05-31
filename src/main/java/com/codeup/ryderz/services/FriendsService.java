package com.codeup.ryderz.services;

import com.codeup.ryderz.data.Friends;
import com.codeup.ryderz.data.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendsService {
    @Autowired
    private UserRepository userRepository;

    public List<Friends> getAllFriends(){

    }
}
