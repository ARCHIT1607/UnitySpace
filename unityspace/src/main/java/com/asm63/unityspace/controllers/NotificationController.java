package com.asm63.unityspace.controllers;

import com.asm63.unityspace.models.CloudMessageDTO;
import com.asm63.unityspace.models.NotificationDTO;
import com.asm63.unityspace.models.PostDTO;
import com.asm63.unityspace.services.FirebaseService;
import com.asm63.unityspace.services.PostService;
import com.google.firebase.messaging.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@CrossOrigin
public class NotificationController {

    @Autowired
    private FirebaseService firebaseService;

    @Autowired
    private PostService postService;

    @PostMapping("/auth/firebase/token")
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
        System.out.println("postId "+postId);
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

    @PostMapping("/firebase/send-friend-request-notification")
    public String sendFriendRequestNotification(@RequestBody NotificationDTO request,
            @RequestParam(name = "friendId") String friendId)
            throws ExecutionException, InterruptedException {
        String token = firebaseService.getToken(friendId);
        System.out.println("friendId in sendFriendRequestNotification"+friendId);
        System.out.println("token "+token);
        WebpushNotification webpushNotification = new WebpushNotification(request.getTitle(), request.getUserId());
        WebpushConfig webpushConfig = WebpushConfig.builder().setNotification(webpushNotification).build();
        Message message = Message.builder()
                .setWebpushConfig(webpushConfig)
                .setToken(token)
//                .putData("userId", request.getUserId())
                .build();

        String response = "";
        try {
            response = FirebaseMessaging.getInstance().send(message);
            System.out.println("response for send-friend-request-notification "+response);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }

}
