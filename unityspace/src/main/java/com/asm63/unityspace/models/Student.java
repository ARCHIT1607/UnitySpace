package com.asm63.unityspace.models;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "STUDENT_SEQ")
    @SequenceGenerator(initialValue = 1, name = "STUDENT_SEQ", sequenceName = "STUDENT_SEQ", allocationSize = 1)
    private Long id;
    private String sid;
    private String fname;
    private String lname;
    private String email;
    private String password;
    private String loc;
    private String course;
    private byte[] profilePic;
    private String pictureName;
    private List<FriendDTO> friends;
    private String role = "ROLE_USER";

    private String viewedProfile;
    private Long impressions;
}
