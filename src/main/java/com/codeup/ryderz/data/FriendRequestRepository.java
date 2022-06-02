package com.codeup.ryderz.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    FriendRequest findFriendRequestByReceiver(Long receiver);

    @Modifying
    @Transactional
    @Query(value = "delete from friends_request WHERE sender = :sender_id and receiver = :receiver_id", nativeQuery = true)
    void deleteFriendsRequest(@Param("sender_id") Long senderId, @Param("receiver_id") Long receiverId );

}
