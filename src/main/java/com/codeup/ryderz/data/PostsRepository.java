package com.codeup.ryderz.data;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface PostsRepository extends JpaRepository<Post, Long> {
    Collection<Post> findPostByAuthor_Username(String username);
}
