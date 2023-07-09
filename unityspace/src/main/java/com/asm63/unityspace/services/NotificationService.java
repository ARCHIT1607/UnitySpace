package com.asm63.unityspace.services;

import com.google.firebase.messaging.*;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class NotificationService {

    public String sendNotification(String title, String body, String token) throws ExecutionException, InterruptedException {
        AndroidNotification androidNotification = AndroidNotification.builder()
                .setTitle(title)
                .setBody(body)
                .build();

        AndroidConfig androidConfig = AndroidConfig.builder()
                .setNotification(androidNotification)
                .build();

        Message message = Message.builder()
                .setAndroidConfig(androidConfig)
                .setToken(token)
                .build();

        return FirebaseMessaging.getInstance().sendAsync(message).get();
    }
}
