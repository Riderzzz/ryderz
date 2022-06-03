package com.codeup.ryderz.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.Collection;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "user")
public class User {


    public enum Role {USER, ADMIN}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100, unique = true)
    private String username;

    @Column(nullable = false, length = 100, unique = true)
    private String email;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false)
    @JsonIgnore
    private LocalDate createdAt;

    @Enumerated(EnumType.STRING)
    @JsonIgnore
    private Role role;

    @Transient
    private String userPhotoUrl;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Transient
    private String userHeaderUrl;

    @Column(name = "header_picture")
    public String headerPicture;

    @Column(name = "bio")
    public String bio;

    @OneToMany(mappedBy = "author")
    @JsonIgnoreProperties({"author"})
    private Collection<Post> posts;


    @OneToMany(mappedBy = "groupOwner")
    @ToString.Exclude
    @JsonIgnoreProperties({"groupOwner", "users"})
    private Collection<Groups> groupsOwned;


    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.REFRESH},
            targetEntity = Groups.class)
    @JoinTable(
            name="group_users",
            joinColumns = {@JoinColumn(name = "user_id", nullable = false, updatable = false)},
            inverseJoinColumns = {@JoinColumn(name="group_id", nullable = false, updatable = false)},
            foreignKey = @ForeignKey(ConstraintMode.CONSTRAINT),
            inverseForeignKey = @ForeignKey(ConstraintMode.CONSTRAINT)
    )
    @ToString.Exclude
    @JsonIgnoreProperties({"users", "groupOwner"})
    private Collection<Groups> groupsJoined;

    @OneToMany(mappedBy = "eventCreator")
    @ToString.Exclude
    @JsonIgnoreProperties({"eventCreator", "comments", "userId"})
    private Collection<Events> events;

    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.REFRESH},
            targetEntity = Events.class)
    @JoinTable(
            name="event_users",
            joinColumns = {@JoinColumn(name = "user_id", nullable = false, updatable = false)},
            inverseJoinColumns = {@JoinColumn(name="event_id", nullable = false, updatable = false)},
            foreignKey = @ForeignKey(ConstraintMode.CONSTRAINT),
            inverseForeignKey = @ForeignKey(ConstraintMode.CONSTRAINT)
    )
    @ToString.Exclude
    @JsonIgnoreProperties({"usersId", "eventCreator", "comments"})
    private Collection<Events> eventsJoined;

    @OneToMany(mappedBy = "author")
    @JsonIgnoreProperties("author")
    private Collection<Comments> comments;


    @OneToMany()
    @JoinColumn(name = "receiver")
    private Collection<FriendRequest> friendsRequest;

    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.REFRESH},
            targetEntity = User.class)
    @JoinTable(
            name="friends",
            joinColumns = {@JoinColumn(name = "user_one_id", nullable = false, updatable = false)},
            inverseJoinColumns = {@JoinColumn(name="user_two_id", nullable = false, updatable = false)},
            foreignKey = @ForeignKey(ConstraintMode.CONSTRAINT),
            inverseForeignKey = @ForeignKey(ConstraintMode.CONSTRAINT)
    )
    @ToString.Exclude
    @JsonIgnoreProperties({"friends", "posts", "groupsOwned", "groupsJoined", "events", "eventsJoined", "comments", "password"})
    private Collection<User> friends;
}
