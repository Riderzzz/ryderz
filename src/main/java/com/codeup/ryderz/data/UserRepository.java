package com.codeup.ryderz.data;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String userName);
    User findByEmail(String email);

    List<User> findAllByUsernameContains(String username);

}
