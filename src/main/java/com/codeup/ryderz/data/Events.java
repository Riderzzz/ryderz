package com.codeup.ryderz.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import javax.persistence.*;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "events")
public class Events implements Comparable<Events>{
    public enum StateOfEvent {NOTSTARTED, INPROGRESS, COMPLETED}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String origin;

    @Column
    private String destination;

    @Column Boolean isSingleLocationEvent;

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
    private String stateWhereEventTakesPlace;

    @Enumerated(EnumType.STRING)
    private StateOfEvent stateOfEvent;

    @Column
    private String eventLocation;

    @Transient
    private String eventImageUrl;

    @Column(name="event_image_name")
    private String eventImageName;

    @Column
    private String routeDistance;

    @Column
    private String routeDuration;

    @Column
    private String routeSummary;

    @PrePersist
    void setCreatedDate() {
        this.createdDate  = new Date();
    }

    @ToString.Exclude
    @ManyToOne
    @JsonIgnoreProperties({"events", "groups", "posts", "groupsOwned" , "groupsJoined", "comments", "eventsJoined", "usersId", "friends"})
    private User eventCreator;

    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.REFRESH},
            targetEntity = User.class)
    @JoinTable(
            name="event_users",
            joinColumns = {@JoinColumn(name = "event_id", nullable = false, updatable = false)},
            inverseJoinColumns = {@JoinColumn(name="user_id", nullable = false, updatable = false)},
            foreignKey = @ForeignKey(ConstraintMode.CONSTRAINT),
            inverseForeignKey = @ForeignKey(ConstraintMode.CONSTRAINT)
    )
    @ToString.Exclude
    @JsonIgnoreProperties({"events", "groups", "posts", "groupsOwned" , "groupsJoined", "comments", "eventsJoined", "usersId", "eventCreator", "password", "friends"})
    private List<User> usersId;

    @ToString.Exclude
    @OneToMany(mappedBy = "event")
    @JsonIgnoreProperties({"event", "post", "group", "comments", "eventCreator"})
    private Collection<Comments> comments;

    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.REFRESH},
            targetEntity = Category.class)
    @ToString.Exclude
    @JsonIgnoreProperties("posts")
    private Collection<Category> categories;

    @Override
    public int compareTo(Events u) {
        if (getCreatedDate() == null || u.getCreatedDate() == null) {
            return 0;
        }
        return getCreatedDate().compareTo(u.getCreatedDate());
    }
}
