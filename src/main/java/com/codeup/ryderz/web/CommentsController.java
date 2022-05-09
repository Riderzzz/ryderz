package com.codeup.ryderz.web;

import com.codeup.ryderz.data.Comments;
import com.codeup.ryderz.data.CommentsRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/comments", headers = "Accept=application/json")
public class CommentsController {

    private final CommentsRepository commentsRepository;

    public CommentsController(CommentsRepository commentsRepository) {
        this.commentsRepository = commentsRepository;
    }

    @GetMapping
    public List<Comments> getAll() {
        return commentsRepository.findAll();
    }

    @PostMapping
    public void createComment(@RequestBody Comments newComment){
        commentsRepository.save(newComment);
    }
}
