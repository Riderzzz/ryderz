package com.codeup.ryderz.data;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriesRepository extends JpaRepository<Category, Long> {
    Category findByName(String name); // select * from categories where name = ?
}