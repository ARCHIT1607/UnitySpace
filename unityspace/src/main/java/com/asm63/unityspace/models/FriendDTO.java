package com.asm63.unityspace.models;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class FriendDTO {

//    @GeneratedValue(strategy = GenerationType.AUTO, generator = "FRIEND_SEQ")
//    @SequenceGenerator(initialValue = 1, name = "FRIEND_SEQ", sequenceName =
//    "FRIEND_SEQ", allocationSize = 1)
    private Long id;

    private String studentId;

    private String friendId;

    private String pictureName;

}
