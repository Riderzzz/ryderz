package com.codeup.ryderz.web;

import com.codeup.ryderz.data.*;
import com.codeup.ryderz.services.S3Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/events", headers = "Accept=application/json")
public class EventsController {

    private EventsRepository eventsRepository;
    private final UserRepository userRepository;
    private final CategoriesRepository categoryRepository;
    private final S3Service s3Service;
    private final CommentsRepository commentRepository;

    public EventsController(EventsRepository eventsRepository, UserRepository userRepository, CategoriesRepository categoryRepository, S3Service s3Service, CommentsRepository commentRepository) {
        this.eventsRepository = eventsRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.s3Service = s3Service;
        this.commentRepository = commentRepository;
    }

    @GetMapping("/{id}")
    public Events getEventById(@PathVariable Long id){
        Events event = eventsRepository.findById(id).get();

        if (event.getEventImageName() != null) {
            String eventImageUrl = s3Service.getSignedURL(event.getEventImageName(), 5L);
            event.setEventImageUrl(eventImageUrl);
        }

        Collection<Comments> eventComments = event.getComments();

        for (Comments comment: eventComments) {
            User commentAuthor = comment.getAuthor();
            String imageName = commentAuthor.getProfilePicture();
            String imageUrl = s3Service.getSignedURL(imageName, 5L);
            commentAuthor.setUserPhotoUrl(imageUrl);
        }

        return event;
    }

    @PostMapping
    private void createEvent(@RequestBody Events newEvent, OAuth2Authentication auth) {
        if (auth != null) {
            String email = auth.getName();
            User user = userRepository.findByEmail(email);
            newEvent.setEventCreator(user);
            List<User> users = new ArrayList<>();
            users.add(user);
            newEvent.setUsersId(users);
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
        List<Events> events = eventsRepository.findAll();

        for (Events event: events) {
            if (event.getEventImageName() != null) {
                String eventImageName = s3Service.getSignedURL(event.getEventImageName(), 5L);
                event.setEventImageUrl(eventImageName);
            }
        }
        return events;
    }

    @PutMapping("{id}")
    private void updateEvent(@PathVariable Long id, @RequestBody Events updatedEvent) {
        Events originalEvent = eventsRepository.getById(id);
        originalEvent.setOrigin(updatedEvent.getOrigin());
        if (updatedEvent.getDestination() == null) {
            originalEvent.setDestination("");
        } else {
            originalEvent.setDestination(updatedEvent.getDestination());
        }
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
    public void addUserToEvent(@PathVariable Long addEventId, OAuth2Authentication auth) {
        User userJoiningGroup = userRepository.findByEmail(auth.getName());
        Events eventToJoin = eventsRepository.getById(addEventId);
        List<User> eventsUsers = eventToJoin.getUsersId();
        eventsUsers.add(userJoiningGroup);
        eventToJoin.setUsersId(eventsUsers);
        eventsRepository.save(eventToJoin);
    }

    @DeleteMapping("{eventId}/remove-user")
    public void removeUserFromEvent(@PathVariable Long eventId, OAuth2Authentication auth) {
        User userToRemove = userRepository.findByEmail(auth.getName());
        Events eventToLeave = eventsRepository.getById(eventId);
        List<User> users = eventToLeave.getUsersId();

        users.remove(userToRemove);
        eventToLeave.setUsersId(users);
        eventsRepository.save(eventToLeave);
    }

    @DeleteMapping("/{eventId}")
    private void deleteEvent(@PathVariable Long eventId) {
        Events event = eventsRepository.getById(eventId);
        if (event.getEventImageName() != null) {
            String imageToDeleteName = event.getEventImageName();
            s3Service.deleteFile(imageToDeleteName);
        }
        event.setUsersId(null);
        Collection<Comments> comments = event.getComments();
        commentRepository.deleteAll(comments);
        eventsRepository.deleteById(eventId);
    }

    @GetMapping("friendsEvents")
    public Collection<Events> getNewsfeedEvents(OAuth2Authentication auth) {
        User mainUser = userRepository.findByEmail(auth.getName());
        mainUser.setUserPhotoUrl(s3Service.getSignedURL(mainUser.getProfilePicture(), 5L));

        Collection<User> userFriends = mainUser.getFriends();
        List<Events> usersFriendsEvents = new ArrayList<>();


        usersFriendsEvents.addAll(eventsRepository.findEventsByEventCreator_Username(mainUser.getUsername()));

        for (User friend : userFriends) {
            usersFriendsEvents.addAll(eventsRepository.findEventsByEventCreator_Username(friend.getUsername()));
            friend.setUserPhotoUrl(s3Service.getSignedURL(friend.getProfilePicture(),5L));
        }

        Collections.sort(usersFriendsEvents);

        return usersFriendsEvents;
    }

    @GetMapping("recentEvents")
    public Collection<Events> getRecentEvents(){
        List<Events> allEvents = eventsRepository.findAll();
        Events event1 = allEvents.get(allEvents.size() - 1);
        Events event2 = allEvents.get(allEvents.size() - 2);
        Events event3 = allEvents.get(allEvents.size() - 3);

        event1.setEventImageUrl(s3Service.getSignedURL(event1.getEventImageName(), 5L));
        event2.setEventImageUrl(s3Service.getSignedURL(event2.getEventImageName(), 5L));
        event3.setEventImageUrl(s3Service.getSignedURL(event3.getEventImageName(), 5L));

        List<Events> recentThree = new ArrayList<>();

        recentThree.add(event1);
        recentThree.add(event2);
        recentThree.add(event3);

        return recentThree;
    }

    @PostMapping("{eventId}/eventUpload")
    public ResponseEntity<String> uploadFile(@PathVariable Long eventId, @RequestParam(value="file") MultipartFile file) {
        Events event = eventsRepository.findById(eventId).get();

        if(event.getEventImageName() != null) {
            String previousImgName = event.getEventImageName();
            s3Service.deleteFile(previousImgName);
        }
        System.out.println(file);
        String fileName = s3Service.uploadFile(file);
        event.setEventImageName(fileName);
        eventsRepository.save(event);
        return new ResponseEntity<>(fileName, HttpStatus.OK);
    }
}


