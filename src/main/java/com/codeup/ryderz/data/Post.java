package com.codeup.ryderz.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import java.util.Collection;
import java.util.Date;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "post")
public class Post implements Comparable<Post>{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String title;
    @Column(nullable = false, length = 5000)
    private String content;
    @Column
    private Date createDate;

    @PrePersist
    void setCreateDate() {
        this.createDate  = new Date();
    }

    @ToString.Exclude
    @ManyToOne
    @JsonIgnoreProperties({"posts","password", "groupsOwned", "groupsJoined", "events", "comments"})
    private User author;

    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.REFRESH},
            targetEntity = Category.class)

    @ToString.Exclude
    @JsonIgnoreProperties("posts")
    private Collection<Category> categories;

    @ToString.Exclude
    @OneToMany(mappedBy = "post")
    @JsonIgnoreProperties({"post", "comments"})
    private Collection<Comments> comments;

    public Post(String title, String content) {
        this.title = title;
        this.content = content;
    }

    @Override
    public int compareTo(Post u) {
        if (getCreateDate() == null || u.getCreateDate() == null) {
            return 0;
        }
        return getCreateDate().compareTo(u.getCreateDate());
    }

}
