package com.asm63.unityspace.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Events {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "EVENT_SEQ")
    @SequenceGenerator(initialValue = 1, name = "EVENT_SEQ", sequenceName = "EVENT_SEQ", allocationSize = 1)
    private Long id;

    private String eventName;

    private String createdDate;

    private String eventDate;

    private boolean isActive;

    private String daysLeft;
}
