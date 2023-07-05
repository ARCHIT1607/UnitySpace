package com.asm63.unityspace.controllers;

import com.asm63.unityspace.models.PostDTO;
import com.asm63.unityspace.models.Student;
import com.asm63.unityspace.services.PostService;
import com.asm63.unityspace.services.StudentService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@CrossOrigin
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private StudentService studentService;

    @PostMapping("/posts/like")
    public ResponseEntity<Object> patchLike(@RequestParam("postId") String postId,@RequestParam("userId") String userId ) {
        System.out.println("calling patchLike");

        postService.patchLike(Long.parseLong(postId),userId);
        return new ResponseEntity<Object>(postService.getUserPosts(userId), HttpStatus.OK);
//        return new ResponseEntity<Object>(postService.getPosts(), HttpStatus.OK);

    }

    @GetMapping("/getPosts")
    public ResponseEntity<Object> getPosts() {
        return new ResponseEntity<Object>(postService.getPosts(), HttpStatus.OK);

    }

    @GetMapping("/posts/{userId}/posts")
    public ResponseEntity<Object> getUserPosts(@PathVariable String userId) {
        System.out.println("getUserPosts "+userId);
        return new ResponseEntity<Object>(postService.getUserPosts(userId), HttpStatus.OK);

    }

    @PostMapping(value = "/posts")
    @Transactional
    public ResponseEntity<Object> createPost(@RequestParam("description") String description,@RequestParam("userId") String userId ) throws Exception {
        try {
            PostDTO post = new PostDTO();
            post.setDescription(description);
            post.setPostUserId(userId);
            Student student = studentService.findById(userId);

            post.setFirstname(student.getFname());
            post.setLastname(student.getLname());
            System.out.println("post.getFirstname()" +post.getFirstname());
            System.out.println("post.getLastname()" +post.getLastname());
            postService.createPost(post);
            System.out.println("post before calling getPost");
            return new ResponseEntity<Object>(postService.getPosts(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            HashMap<Object, Object> map = new HashMap<>();
            if(e.getMessage().equals("user already exists")) {
                map.put("errorMsg", e.getMessage());
                map.put("errorType", "user_exists");
            }else {
                e.printStackTrace();
                map.put("errorMsg", e.getMessage());
            }
            return new ResponseEntity<Object>(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
