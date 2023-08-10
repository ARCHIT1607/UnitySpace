package com.asm63.unityspace.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "friend_request"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class FriendRequestDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "FRIEND_REQ_SEQ")
    @SequenceGenerator(initialValue = 1, name = "FRIEND_REQ_SEQ", sequenceName = "FRIEND_REQ_SEQ", allocationSize = 1)
    private Long id;

    private String senderId;

    private String friendId;

    private String status;
}
