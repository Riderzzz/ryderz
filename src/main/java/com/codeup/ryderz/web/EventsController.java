package com.codeup.ryderz.web;

import com.codeup.ryderz.data.*;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/events", headers = "Accept=application/json")
public class EventsController {

    private EventsRepository eventsRepository;
    private final UserRepository userRepository;
    private final CategoriesRepository categoryRepository;

    public EventsController(EventsRepository eventsRepository, UserRepository userRepository, CategoriesRepository categoryRepository) {
        this.eventsRepository = eventsRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/{id}")
    public Optional<Events> getEventById(@PathVariable Long id){
        return eventsRepository.findById(id);
    }

    @PostMapping
    private void createEvent(@RequestBody Events newEvent, OAuth2Authentication auth) {
        if (auth != null) {
            String email = auth.getName();
            User user = userRepository.findByEmail(email);
            newEvent.setEventCreator(user);
        }

        newEvent.setStateOfEvent(Events.StateOfEvent.NOTSTARTED);

        Collection<Category> categories = new ArrayList<>();

        for (Category category : newEvent.getCategories()) {
            System.out.println(category.getName());
            categories.add(categoryRepository.findByName(category.getName()));
        }

        newEvent.setCategories(categories);

        eventsRepository.save(newEvent);
        System.out.println("Event Created!");
    }

    @GetMapping()
    public List<Events> getAllEvents() {
        return eventsRepository.findAll();
    }

    @PutMapping("{id}")
    private void updateEvent(@PathVariable Long id, @RequestBody Events updatedEvent) {
        Events originalEvent = eventsRepository.getById(id);
        originalEvent.setStartingLongitude(updatedEvent.getStartingLongitude());
        originalEvent.setStartingLatitude(updatedEvent.getStartingLatitude());
        originalEvent.setEndingLongitude(updatedEvent.getEndingLongitude());
        originalEvent.setEndingLatitude(updatedEvent.getEndingLatitude());
        originalEvent.setEventDate(updatedEvent.getEventDate());
        originalEvent.setStateWhereEventTakesPlace(updatedEvent.getStateWhereEventTakesPlace());
        originalEvent.setTitleOfEvent(updatedEvent.getTitleOfEvent());
        originalEvent.setDescriptionOfEvent(updatedEvent.getDescriptionOfEvent());
        originalEvent.setStateOfEvent(updatedEvent.getStateOfEvent());
        originalEvent.setEventLocation(updatedEvent.getEventLocation());

        Collection<Category> categories = new ArrayList<>();

        for (Category category : updatedEvent.getCategories()) {
            System.out.println(category.getName());
            categories.add(categoryRepository.findByName(category.getName()));
        }

        originalEvent.setCategories(categories);

        eventsRepository.save(originalEvent);
        System.out.println("Ready to update event.");
    }
    @PutMapping("{addEventId}/adduser")
    public void addUserToEvent(@PathVariable Long addEventId, @RequestParam Long userId) {
        User userJoiningGroup = userRepository.getById(userId);
        Events eventToJoin = eventsRepository.getById(addEventId);
        List<User> eventsUsers = eventToJoin.getUsersId();
        eventsUsers.add(userJoiningGroup);
        eventToJoin.setUsersId(eventsUsers);
        eventsRepository.save(eventToJoin);
    }

    @DeleteMapping("/{eventId}")
    private void deleteEvent(@PathVariable Long eventId) {
        eventsRepository.deleteById(eventId);
    }
}
