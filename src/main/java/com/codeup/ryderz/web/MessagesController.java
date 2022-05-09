package com.codeup.ryderz.web;

import com.codeup.ryderz.data.Messages;
import com.codeup.ryderz.data.MessagesRepository;
import com.codeup.ryderz.data.Post;
import com.codeup.ryderz.data.UserRepository;
import lombok.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.persistence.Entity;
import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping(value = "/api/messages", headers = "Accept=application/json")
public class MessagesController {
    private MessagesRepository messagesRepository;

    @GetMapping
    private List<Messages> getAll() {
        return messagesRepository.findAll();
    }

    @GetMapping("{messageId}")
    private Optional<Messages> getById(@PathVariable Long messageId) {
        return messagesRepository.findById(messageId);
    }

    @PostMapping("create")
    private void create(@RequestBody Messages newMessage) {
//                newOrder.getOrderNumber(ordersRepository.getById(1L));
        newMessage.setAuthor(newMessage.getAuthor());
        newMessage.setContent(newMessage.getContent());
        messagesRepository.save(newMessage);
        System.out.println("Ready to create message." + newMessage);
    }

    @PutMapping("{id}")
    private void update(@PathVariable Long id, @RequestBody Messages newMessage) {
//        fetch the original post of the same id from the database using your postsRepository
//        copy the non-null fields from newPost to original post (i.e., title and content)
//        save the original post to the db using postsRepository
        System.out.println("Ready to update message." + id + newMessage);
        Messages originalMessage = messagesRepository.getById(id);
        originalMessage.setContent(newMessage.getContent());
        messagesRepository.save(originalMessage);
    }


    @DeleteMapping("{messageId}")
    private void deleteUser(@PathVariable Long messageId) {
        System.out.println("ready to delete message." + messageId);
        Messages originalMessage = messagesRepository.getById(messageId);
        messagesRepository.delete(originalMessage);

    }
}
