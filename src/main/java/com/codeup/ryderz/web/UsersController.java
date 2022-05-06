package com.codeup.ryderz.web;

import com.codeup.ryderz.data.User;
import com.codeup.ryderz.data.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/users", headers = "Accept=application/json")
public class UsersController {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public UsersController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("me")
    private User getMyInfo(OAuth2Authentication auth){
        String userName = auth.getName();
        return userRepository.findByEmail(userName);
    }
    @GetMapping
    private List<User> getUser() {
        return userRepository.findAll();
    }

    @GetMapping("{userID}")
    public Optional<User> getUserById(@PathVariable Long userID) {

        return userRepository.findById(userID);
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
        userRepository.save(user);
        System.out.println("Ready to add user." + newUser);
    }

    @PutMapping("{id}")
    private void updateUser(@PathVariable Long id, @RequestBody User newUser) {
        System.out.println("Ready to update user." + id + newUser);
    }

    @PutMapping("{id}/updatePassword")
    private void updatePassword(@PathVariable Long id, @RequestParam(required = false) String oldPassword, @Valid @Size(min = 3) @RequestParam String newPassword) {

        System.out.println("changing password to " + newPassword);
    }

    @DeleteMapping("{userId}")
    private void deleteUser(@PathVariable Long userId) {
        System.out.println("ready to delete User." + userId);
    }
}
