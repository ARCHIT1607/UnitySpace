package com.asm63.unityspace.models;

import jakarta.persistence.Id;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PostDTO {

    @Id
    private Long id;
    private String postUserId;

    private String firstname;
    private String lastname;
    private String description;
    private String location;

    private byte[] picture;
    private String picturePath;
    private String userPicturePath;
    private String likes;

    private String[] comments;
}
