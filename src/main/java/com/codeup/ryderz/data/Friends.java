package com.codeup.ryderz.data;


import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "friends")
public class Friends {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   @ManyToOne
    @JoinColumn(name = "user_one_id", referencedColumnName = "id")
    User userOne;

   @ManyToOne
    @JoinColumn(name = "user_two_id", referencedColumnName = "id")
    User UserTwo;

}
