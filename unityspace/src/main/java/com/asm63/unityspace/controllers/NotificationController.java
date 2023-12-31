package com.asm63.unityspace.controllers;

import com.asm63.unityspace.models.CloudMessageDTO;
import com.asm63.unityspace.models.NotificationDTO;
import com.asm63.unityspace.models.PostDTO;
import com.asm63.unityspace.services.FirebaseService;
import com.asm63.unityspace.services.PostService;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushNotification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@CrossOrigin(origins ="http://localhost:3000")
public class NotificationController {

    @Autowired
    private FirebaseService firebaseService;

    @Autowired
    private PostService postService;

    @PostMapping("/firebase/token")
    public ResponseEntity<Object> addFirebaseToken(@RequestBody CloudMessageDTO message ) {
        System.out.println("calling addFirebaseToken");
        String token = firebaseService.getToken(message.getUserId());
        if(token==null){
            firebaseService.addFirebaseToken(message);
        }else{
            System.out.println("User token already exists");
        }

        return new ResponseEntity<Object>("Firebase token successfully", HttpStatus.OK);
    }

    @PostMapping("/firebase/send-notification")
    public String sendNotification(@RequestBody NotificationDTO request,
    @RequestParam(name = "postId") String postId)
            throws ExecutionException, InterruptedException {
        PostDTO post = postService.getPost(Long.parseLong(postId));
        String token = firebaseService.getToken(post.getPostUserId());
        System.out.println("post.getPostUserId() "+post.getPostUserId());
        System.out.println("token "+token);
        WebpushNotification webpushNotification = new WebpushNotification(request.getTitle(), request.getUserId());
        WebpushConfig webpushConfig = WebpushConfig.builder().setNotification(webpushNotification).build();
        Message message = Message.builder()
                .setWebpushConfig(webpushConfig)
                .setToken(token)
                .putData("userId", post.getPostUserId())
                .build();

        String response = "";
        try {
            response = FirebaseMessaging.getInstance().send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }
}
