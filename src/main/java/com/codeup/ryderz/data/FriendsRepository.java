package com.codeup.ryderz.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface FriendsRepository extends JpaRepository<Friends,Long> {

    @Modifying
    @Transactional
    @Query(value = "delete from friends WHERE  user_two_id= :sender_id and user_one_id = :receiver_id", nativeQuery = true)
    void deleteFriends(@Param("sender_id") Long senderId, @Param("receiver_id") Long receiverId );
}
