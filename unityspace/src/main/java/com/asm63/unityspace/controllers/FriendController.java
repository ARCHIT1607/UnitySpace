package com.asm63.unityspace.controllers;

import com.asm63.unityspace.models.Student;
import com.asm63.unityspace.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@CrossOrigin
public class FriendController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/users")
    public ResponseEntity<Object> users(@RequestParam(name = "id") String id,
                                                 @RequestParam(name = "friendId") String friendId) throws Exception{
        Student friendSId = studentService.findByFriendId(friendId);
        System.out.println("Friend id " + friendSId.getSid());
            if (friendSId.getSid().length()==0) {
                throw new Exception("Student doesn't Exist");
            } else{
                System.out.println("before calling  addFriend service ");
                studentService.addFriend(studentService.findByFriendId(id).getSid(), friendSId.getSid());
                HashMap<Object, Object> map = new HashMap<>();
                map.put("friend",studentService.getFriends(id));
                System.out.println("after calling  addFriend service "+ map.get("friend"));
                return new ResponseEntity<Object>(map, HttpStatus.OK);
            }
    }

    @GetMapping("/users/friends")
    public ResponseEntity<Object> friends(@RequestParam(name = "id") String userId) {

        return new ResponseEntity<Object>(studentService.getFriends(userId),HttpStatus.OK);

    }

    @GetMapping("/getUser")
    public ResponseEntity<Student> getUser(@RequestParam(name = "userId") String userId) {

        return new ResponseEntity<Student>(studentService.findById(userId),HttpStatus.OK);

    }

    @GetMapping("/user")
    public ResponseEntity<Student> getProfileUser(@RequestParam(name = "userId") String userId) {

        return new ResponseEntity<Student>(studentService.findById(userId),HttpStatus.OK);

    }

}
