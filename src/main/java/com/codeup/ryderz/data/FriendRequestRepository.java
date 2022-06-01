package com.codeup.ryderz.data;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    FriendRequest findFriendRequestByReceiver(Long receiver);
}
