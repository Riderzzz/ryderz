package com.codeup.ryderz.data;

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
@Table(name = "groups")
public class Groups {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column
    private String bio;

    @Column
    private Date createdDate;

    @PrePersist
    void setCreatedDate() {
        this.createdDate  = new Date();
    }

    @Column
    private String location;

    @ManyToOne
    @JsonIgnoreProperties({"groupsOwned", "events", "groupsJoined", "posts"})
    private User groupOwner;

    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.REFRESH},
            targetEntity = User.class)
    @JoinTable(
            name="group_users",
            joinColumns = {@JoinColumn(name = "group_id", nullable = false, updatable = false)},
            inverseJoinColumns = {@JoinColumn(name="user_id", nullable = false, updatable = false)},
            foreignKey = @ForeignKey(ConstraintMode.CONSTRAINT),
            inverseForeignKey = @ForeignKey(ConstraintMode.CONSTRAINT)
    )
    @JsonIgnoreProperties({"groupsJoined", "groupsOwned", "events", "posts"})
    private List<User> users;

    @OneToMany(mappedBy = "group")
    private Collection<Comments> comments;
}
