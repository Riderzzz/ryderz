package com.codeup.ryderz.web;

import com.codeup.ryderz.data.*;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/categories", headers = "Accept=application/json")
public class CategoriesController {
    private final CategoriesRepository categoryRepository;

    public CategoriesController(CategoriesRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    private Category getPostsByCategory(@RequestParam String categoryName) {
        return categoryRepository.findByName(categoryName);
    }
}