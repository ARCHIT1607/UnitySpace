package com.asm63.unityspace.controllers;

import com.asm63.unityspace.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@RestController
@CrossOrigin(origins ="http://localhost:3000")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/send-notification")
    public String sendNotification(@RequestParam String title, @RequestParam String body, @RequestParam String token) throws ExecutionException, InterruptedException {
        return notificationService.sendNotification(title, body, token);
    }
}
