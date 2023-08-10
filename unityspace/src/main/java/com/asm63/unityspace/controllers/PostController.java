package com.asm63.unityspace.controllers;

import com.asm63.unityspace.models.PostDTO;
import com.asm63.unityspace.models.Student;
import com.asm63.unityspace.services.PostService;
import com.asm63.unityspace.services.StreamingService;
import com.asm63.unityspace.services.StudentService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;

@RestController
@CrossOrigin
@Transactional
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private StreamingService service;

    @PostMapping("/postComment")
    public ResponseEntity<Object> postComment(@RequestParam("postId") String postId,@RequestParam("comment") String comment,
                                              @RequestParam("userId") String userId) {
        try {
            System.out.println("calling postComment");
            postService.postComment(Long.parseLong(postId),comment,userId);
            return new ResponseEntity<Object>(postService.getPosts(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }
    }

    @PostMapping("/posts/like")
    public ResponseEntity<Object> patchLike(@RequestParam("postId") String postId,@RequestParam("userId") String userId ) {
        try {
            System.out.println("calling patchLike");
            postService.patchLike(Long.parseLong(postId),userId);
            return new ResponseEntity<Object>(postService.getPosts(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }
    }

    @GetMapping("/getPosts")
    public ResponseEntity<Object> getPosts(Authentication authentication) {

        try {
            return new ResponseEntity<Object>(postService.getPosts(), HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }
    }

    @GetMapping("/delete/post")
    public ResponseEntity<Object> deletePost(@RequestParam("postId") String postId) {
        try {
            postService.deletePost(postId);
            return new ResponseEntity<Object>(postService.getPosts(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }


    }

    @GetMapping(value = "/post/image/{picturePath}",produces = MediaType.IMAGE_JPEG_VALUE)
    public void downloadImage(@PathVariable("picturePath") String picturePath, HttpServletResponse response) throws IOException {
            InputStream resource = postService.getResource(picturePath);
            response.setContentType(MediaType.IMAGE_JPEG_VALUE);
            StreamUtils.copy(resource,response.getOutputStream());
    }

    @GetMapping(value = "video/{title}", produces = "video/mp4")
    public Mono<Resource> getVideos(@PathVariable String title) {
//        System.out.println("range in bytes() : " + range);
        return service.getVideo(title);

    }

    @GetMapping("/posts/{userId}/posts")
    public ResponseEntity<Object> getUserPosts(@PathVariable String userId) {
        try {
            System.out.println("getUserPosts "+userId);
            return new ResponseEntity<Object>(postService.getUserPosts(userId), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }
    }

    @PostMapping(value = "/posts")
    @Transactional
    public ResponseEntity<Object> createPost(@RequestParam("description") String description,@RequestParam("userId") String userId,
                                             @RequestParam("userPicturePath") String userPicturePath,
                                             @RequestParam(value = "picture",required = false) MultipartFile picture) throws Exception {

        try {
            PostDTO post = new PostDTO();
            post.setDescription(description);
            post.setPostUserId(userId);
            post.setUserPicturePath(userPicturePath);
            Student student = studentService.findById(userId);

            post.setFirstname(student.getFname());
            post.setLastname(student.getLname());
            post.setLocation(student.getLoc());
            post.setCourse(student.getCourse());
            System.out.println("post.getFirstname()" +post.getFirstname());
            System.out.println("post.getLastname()" +post.getLastname());
            System.out.println("picture" +picture);
            postService.createPost(post,picture);
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
    @PostMapping(value = "/updatePost")
    @Transactional
    public ResponseEntity<Object> updatePost(@RequestParam("description") String description,@RequestParam("postId") String postId,
                                             @RequestParam(value = "picture",required = false) MultipartFile picture) throws Exception {

        try {
            PostDTO post = postService.getPost(Long.parseLong(postId));
            post.setDescription(description);
            postService.updatePost(post,picture);
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

    @GetMapping("/dashboard/getDashboardData")
    public ResponseEntity<Object> getDashboardData() {
        try {
            System.out.println("calling getDashboardData");
            return new ResponseEntity<Object>(postService.getDashboardData(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }
    }

}
