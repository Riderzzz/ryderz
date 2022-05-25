package com.codeup.ryderz.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;

public interface EventsRepository extends JpaRepository<Events, Long> {
    Collection<Events> findEventsByEventCreator_Username(String username);
}
