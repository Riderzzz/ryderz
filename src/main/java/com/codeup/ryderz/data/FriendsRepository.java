package com.codeup.ryderz.data;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendsRepository extends JpaRepository<Friends,Long> {

    boolean existsByFirstUserAndSecondUser(User first,User second);

    List<Friends> findByFirstUser(User user);
    List<Friends>findBySecondUser(User user);

}
