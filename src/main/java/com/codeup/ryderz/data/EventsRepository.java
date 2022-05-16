package com.codeup.ryderz.data;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface EventsRepository extends JpaRepository<Events, Long> {
    Collection<Events> findEventsByEventCreator_Username(String username);
}
