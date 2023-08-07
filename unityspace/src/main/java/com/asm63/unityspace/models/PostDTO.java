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
//    @GeneratedValue(strategy = GenerationType.AUTO, generator = "EVENT_SEQ")
//    @SequenceGenerator(initialValue = 1, name = "EVENT_SEQ", sequenceName = "EVENT_SEQ", allocationSize = 1)
    private Long id;
    private String postUserId;

    private String firstname;
    private String lastname;
    private String description;
    private String course;
    private String location;

    private byte[] picture;
    private String picturePath;
    private String userPicturePath;
    private String likes;

    private String[] comments;

    private String createdDate;

    private String createdBy;
}
