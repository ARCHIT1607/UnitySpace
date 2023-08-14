package com.asm63.unityspace.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;

@Entity
@Table(name = "post"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PostDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "POST_SEQ")
    @SequenceGenerator(initialValue = 1, name = "POST_SEQ", sequenceName = "POST_SEQ", allocationSize = 1)
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

    private ArrayList<String> comments;

    private String createdDate;

    private String createdBy;
}
