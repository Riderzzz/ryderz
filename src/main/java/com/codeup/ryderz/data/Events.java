package com.codeup.ryderz.data;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;

public class Events {
    @Id
    private Long id;
    @Column(nullable = false)
    private Double startingLongitude;
    @Column(nullable = false)
    private Double startingLatitude;
    @Column(nullable = false)
    private Double endingLongitude;
    @Column(nullable = false)
    private Double endingLatitude;
    @Column(nullable = false)
    private Date createdDate;
    @Column(nullable = false)
    private Date eventDate;
    @Column(nullable = false)
    private String titleOfEvent;
    @Column(nullable = false)
    private String descriptionOfEvent;
    @Column(nullable = false)
    private String stateWhereEventTakesPlace;
    @Column(nullable = false)
    private String eventLocation;

    @PrePersist
    void setCreatedDate() {
        this.createdDate  = new Date();
    }

    @ManyToOne
    private User eventUserId;
}
