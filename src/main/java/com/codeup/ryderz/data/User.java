package com.codeup.ryderz.data;

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
    private LocalDate createdAt;
    @Enumerated(EnumType.STRING)
    private Role role;
    @OneToMany(mappedBy = "author")
    @JsonIgnoreProperties("author")
    private Collection<Post> posts;


    @OneToMany(mappedBy = "groupOwner")
    @JsonIgnoreProperties("groupOwner")
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
    @JsonIgnoreProperties("users")
    private Collection<Groups> groupsJoined;

}
