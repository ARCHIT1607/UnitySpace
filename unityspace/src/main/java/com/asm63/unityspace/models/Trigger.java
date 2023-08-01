package com.asm63.unityspace.models;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Trigger {
    private String senderName;
    private String receiverName;
    private String message;
    private String date;

}
