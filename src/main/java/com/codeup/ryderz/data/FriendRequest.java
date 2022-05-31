package com.codeup.ryderz.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "friends_request")
public class FriendRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender")
    @JsonIgnoreProperties({"friends", "posts", "groupsOwned", "groupsJoined", "events", "eventsJoined", "comments", "password","friendsRequest"})
   private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver")
    @JsonIgnoreProperties({"friends", "posts", "groupsOwned", "groupsJoined", "events", "eventsJoined", "comments", "password","friendsRequest"})
    private User receiver;
}
