package com.asm63.unityspace.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="fb_cloud_message")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CloudMessageDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "FIREBASE_TOKEN_SEQ")
    @SequenceGenerator(initialValue = 1, name = "FIREBASE_TOKEN_SEQ", sequenceName = "FIREBASE_TOKEN_SEQ", allocationSize = 1)
    private Long id;

    private String userId;

    private String firebase_token;
}
