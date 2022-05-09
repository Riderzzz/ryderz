package com.codeup.ryderz.web;

import com.codeup.ryderz.data.Comments;
import com.codeup.ryderz.data.CommentsRepository;
import com.codeup.ryderz.data.Events;
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

    @PutMapping("{id}")
    private void updateComment(@PathVariable Long id, @RequestBody Comments updateComment){
        Comments comments = updateComment;
        Comments update = commentsRepository.getById(id);
        update.setContent(updateComment.getContent());
        commentsRepository.save(update);
        System.out.println("updating comment " + id + comments);
    }

    @DeleteMapping("{commentId}")
    private void deleteComment(@PathVariable Long commentId) {
        commentsRepository.deleteById(commentId);
    }
}
