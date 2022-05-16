package com.codeup.ryderz.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import java.util.Date;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

@Entity
@Table(name = "comments")
public class Comments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Column
    private Date createdAt;

    @ToString.Exclude
    @ManyToOne
    @JsonIgnoreProperties({"comments", "author", "title", "content", "categories", "eventCreator", "usersId"})
    private Events event;

    @ToString.Exclude
    @ManyToOne
    @JsonIgnoreProperties({"comments", "groupOwner", "users", } )
    private Groups group;

    @ToString.Exclude
    @ManyToOne
    @JsonIgnoreProperties({"comments", "author", "title", "content", "categories"})
    private Post post;

    @ToString.Exclude
    @ManyToOne
    @JsonIgnoreProperties({"comments","password", "posts", "groupsOwned", "events", "groupsJoined"})
    private User author;

    @PrePersist
    void setCreatedAt() {
        this.createdAt  = new Date();
    }
}
