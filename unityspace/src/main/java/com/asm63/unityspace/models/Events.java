package com.asm63.unityspace.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    private Long id;

    private String eventName;

    private String createdDate;

    private String eventDate;

    private boolean isActive;

    private String daysLeft;
}
