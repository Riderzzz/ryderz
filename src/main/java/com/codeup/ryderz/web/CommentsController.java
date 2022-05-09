package com.codeup.ryderz.web;

import com.codeup.ryderz.data.*;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/comments", headers = "Accept=application/json")
public class CommentsController {

    private final CommentsRepository commentsRepository;
    private final UserRepository userRepository;


    public CommentsController(CommentsRepository commentsRepository, UserRepository userRepository) {
        this.commentsRepository = commentsRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Comments> getAll() {
        return commentsRepository.findAll();
    }

    @PostMapping
    public void createComment(@RequestBody Comments newComment, OAuth2Authentication auth){
        User user = userRepository.findByEmail(auth.getName());
        newComment.setAuthor(user);
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
