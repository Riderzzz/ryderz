package com.codeup.ryderz.web;

import com.codeup.ryderz.data.Events;
import com.codeup.ryderz.data.EventsRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/events", headers = "Accept=application/json")
public class EventsController {

    private EventsRepository eventsRepository;

    public EventsController(EventsRepository eventsRepository) {
        this.eventsRepository = eventsRepository;
    }

    @GetMapping("/{id}")
    public Optional<Events> getEventById(@PathVariable Long id){
        return eventsRepository.findById(id);
    }

    @PostMapping
    private void createEvent(@RequestBody Events newEvent) {
        Events event = newEvent;
        event.setCreatedDate(newEvent.getCreatedDate());
        event.setStartingLatitude(newEvent.getStartingLatitude());
        event.setStartingLongitude(newEvent.getStartingLongitude());
        event.setEndingLatitude(newEvent.getEndingLatitude());
        event.setEndingLongitude(newEvent.getEndingLongitude());
        event.setEventDate(newEvent.getEventDate());
        event.setTitleOfEvent(newEvent.getTitleOfEvent());
        event.setDescriptionOfEvent(newEvent.getDescriptionOfEvent());
        event.setStateOfEvent(newEvent.getStateOfEvent());
        event.setEventLocation(newEvent.getEventLocation());
        eventsRepository.save(event);
        System.out.println("Ready to add event." + newEvent);
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

    @DeleteMapping("/{eventId}")
    private void deleteEvent(@PathVariable Long eventId) {
        eventsRepository.deleteById(eventId);
    }
}
