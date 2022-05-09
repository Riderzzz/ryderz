package com.codeup.ryderz.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
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

    @ManyToOne
    @JsonIgnoreProperties({"comments", "author", "title", "content", "categories"})
    private Events event;

    @ManyToOne
    @JsonIgnoreProperties({"comments", "author", "title", "content", "categories"})
    private Post post;

    @ManyToOne
    @JsonIgnoreProperties({"comments","password", "posts", "groupsOwned", "events", "groupsJoined"})
    private User author;

    @PrePersist
    void setCreatedAt() {
        this.createdAt  = new Date();
    }
}
