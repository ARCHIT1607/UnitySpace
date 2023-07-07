package com.asm63.unityspace.models;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Student {


    private Long id;
    private String sid;
    private String fname;
    private String lname;
    private String email;
    private String password;
    private String loc;
    private String course;

    private List<FriendDTO> friends;
    private String role = "ROLE_USER";

    private String viewedProfile;
    private Long impressions;
}
