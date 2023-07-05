package com.asm63.unityspace.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;


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
    private String picturePath;
    private String userPicturePath;
    private String likes;

    private ArrayList<Comment> comments;
}
