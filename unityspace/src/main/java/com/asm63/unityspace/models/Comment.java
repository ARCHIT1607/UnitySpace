package com.asm63.unityspace.models;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "comment"
)
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "COMMENT_SEQ")
    @SequenceGenerator(initialValue = 1, name = "COMMENT_SEQ", sequenceName = "COMMENT_SEQ", allocationSize = 1)
    private Long id;
    private String comment;

    private String userId;

    private Long postId;
}
