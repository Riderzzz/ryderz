package com.codeup.ryderz.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "events")
public class Events {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Double startingLongitude;

    @Column
    private Double startingLatitude;

    @Column
    private Double endingLongitude;

    @Column
    private Double endingLatitude;

    @Column
    private Date createdDate;

    @Column
    private Date eventDate;

    @Column
    private String titleOfEvent;

    @Column
    private String descriptionOfEvent;

    @Column
    private String stateOfEvent;

    @Column
    private String eventLocation;

    @PrePersist
    void setCreatedDate() {
        this.createdDate  = new Date();
    }

    @ManyToOne
    @JsonIgnoreProperties({"events", "password", "groups", "posts", "email", "createdAt", "role"})
    private User eventCreator;

    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.REFRESH},
            targetEntity = Category.class)
    @JoinTable(
            name="event_users",
            joinColumns = {@JoinColumn(name = "event_id", nullable = false, updatable = false)},
            inverseJoinColumns = {@JoinColumn(name="user_id", nullable = false, updatable = false)},
            foreignKey = @ForeignKey(ConstraintMode.CONSTRAINT),
            inverseForeignKey = @ForeignKey(ConstraintMode.CONSTRAINT)
    )

    @JsonIgnoreProperties("events")
    private List<User> userCreatedEventId;
}
