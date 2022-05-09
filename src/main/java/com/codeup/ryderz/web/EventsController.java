package com.codeup.ryderz.web;

import com.codeup.ryderz.data.*;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/events", headers = "Accept=application/json")
public class EventsController {

    private EventsRepository eventsRepository;
    private final UserRepository userRepository;

    public EventsController(EventsRepository eventsRepository, UserRepository userRepository) {
        this.eventsRepository = eventsRepository;
        this.userRepository = userRepository;
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

        eventsRepository.save(newEvent);
        System.out.println("Event Created!");
    }

    @GetMapping()
    public List<Events> getAllEvents() {
        return eventsRepository.findAll();
    }

    @PutMapping("{id}")
    private void updateEvent(@PathVariable Long id, @RequestBody Events updateEvent) {
        Events events = updateEvent;
        events.setCreatedDate(updateEvent.getCreatedDate());
        events.setStartingLatitude(updateEvent.getStartingLatitude());
        events.setStartingLongitude(updateEvent.getStartingLongitude());
        events.setEndingLatitude(updateEvent.getEndingLatitude());
        events.setEndingLongitude(updateEvent.getEndingLongitude());
        events.setEventDate(updateEvent.getEventDate());
        events.setTitleOfEvent(updateEvent.getTitleOfEvent());
        events.setDescriptionOfEvent(updateEvent.getDescriptionOfEvent());
        events.setStateOfEvent(updateEvent.getStateOfEvent());
        events.setEventLocation(updateEvent.getEventLocation());
        eventsRepository.save(events);
        System.out.println("Ready to update event." + id + updateEvent);
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
