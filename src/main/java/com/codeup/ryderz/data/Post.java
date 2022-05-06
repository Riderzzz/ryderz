package com.codeup.ryderz.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import java.util.Collection;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String title;
    @Column(nullable = false, length = 5000)
    private String content;
    @ManyToOne
    @JsonIgnoreProperties({"post","password"})
    private User author;

    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.REFRESH},
            targetEntity = Category.class)


    @JsonIgnoreProperties("posts")
    private Collection<Category> categories;

    public Post(String title, String content) {
        this.title = title;
        this.content = content;
    }

}
