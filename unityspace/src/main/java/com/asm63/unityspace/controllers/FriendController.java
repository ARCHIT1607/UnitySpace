package com.asm63.unityspace.controllers;

import com.asm63.unityspace.models.FriendRequestDTO;
import com.asm63.unityspace.models.Student;
import com.asm63.unityspace.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@CrossOrigin
public class FriendController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/users/sendFriendRequest")
    public ResponseEntity<Object> sendFriendRequest(@RequestParam(name = "senderId") String senderId,
                                                    @RequestParam(name = "friendId") String friendId) {

        try {

            FriendRequestDTO request = new FriendRequestDTO();
            request.setFriendId(friendId);
            request.setSenderId(senderId);
            request.setStatus("Pending");
            HashMap friendRequest = studentService.checkFriendRequestExists(request);
            System.out.println("friendRequest "+friendRequest);
            if(friendRequest==null){
                studentService.sendFriendRequest(request);
                System.out.println("sendFriend Request done");
                return new ResponseEntity<Object>("Friend Request sent successfully",HttpStatus.OK);
            }

            return new ResponseEntity<Object>("Friend Request already exists",HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }

    }

    @GetMapping("users/checkFriendRequest")
    public ResponseEntity<Object> checkFriendRequest(@RequestParam(name = "friendId") String friendId) {

        try {
            return new ResponseEntity<Object>(studentService.checkFriendRequest(friendId),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }

    }

    @PostMapping("/users/deleteFriendRequest")
    public ResponseEntity<Object> deleteFriendRequest(@RequestParam(name = "friendId") String friendId,
                                                      @RequestParam(name = "senderId") String senderId     ) {

        try {
            return new ResponseEntity<Object>(studentService.deleteFriendRequest(friendId,senderId),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }

    }

    @GetMapping("/patchFriend")
    public ResponseEntity<Object> patchFriend(@RequestParam(name = "id") String id,
                                                 @RequestParam(name = "friendId") String friendId) throws Exception{
        HashMap<Object, Object> map = new HashMap<>();
        try {
            ArrayList<HashMap> friends = studentService.getFriends(id);
            System.out.println("friends "+friends + "friendId " +friendId);
            boolean isFriend = false;
            if(friends!=null){
                for(HashMap h : friends) {
                    System.out.println("h.get(\"sid\").equals(friendId)" +h.get("sid").equals(friendId));
                    if(h.get("sid").equals(friendId))
                    {
                        isFriend = true;
                    }
                }
                if (isFriend) {
                    System.out.println("after calling  delete service "+ friendId);
                    studentService.deleteFriend(id, friendId);
                    studentService.deleteFriend(friendId, id);
                } else{
                    System.out.println("before calling  addFriend service ");
                    studentService.addFriend(studentService.findByFriendId(id).getSid(), friendId);

                }
            }

            map.put("friend",studentService.getFriends(id));
        }catch (Exception e){
            map.put("errorMsg",e.getMessage());
        }
        return new ResponseEntity<Object>(map, HttpStatus.OK);
    }

    @GetMapping("/users/friends")
    public ResponseEntity<Object> friends(@RequestParam(name = "id") String userId) {

        try {
            return new ResponseEntity<Object>(studentService.getFriends(userId),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }

    }

    @GetMapping("/getUser")
    public ResponseEntity<?> getUser(@RequestParam(name = "userId") String userId) {
        try {
            return new ResponseEntity<Student>(studentService.findById(userId),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }


    }

    @GetMapping("/user")
    public ResponseEntity<?> getProfileUser(@RequestParam(name = "userId") String userId,@RequestParam(name = "sid") String sid) {

        try {
            if (!userId.equals(sid)) {
                studentService.updateViewer(userId, sid);
            } else {
                System.out.println("Viewer and profile user is same");
            }
            return new ResponseEntity<Student>(studentService.findById(userId),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }


    }

    @GetMapping("/events")
    public ResponseEntity<Object> getEvents() {
        try {
            return new ResponseEntity<Object>(studentService.getEvents(),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }


    }

    @GetMapping("/allStudents")
    public ResponseEntity<?> allStudents() {
        try {
            return new ResponseEntity<List<HashMap>>(studentService.findAllStudent(),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }

    }

    @PostMapping("/updateOnlineStatus")
    public ResponseEntity<?> updateOnlineStatus(@RequestParam(name = "status") String status, @RequestParam(name = "userId") String userId) {
        try {
            studentService.updateOnlineStatus(Boolean.parseBoolean(status), userId);
            return new ResponseEntity<>(studentService.findById(userId),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }

    }

    @PostMapping("/user/deleteAccount")
    public ResponseEntity<String> deleteAccount( @RequestParam(name = "user") String userId) {
        try {
            studentService.deleteUser(userId);
            return new ResponseEntity<String>("Account deleted successfully",HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.OK);
        }

    }

    @GetMapping("/users/recommendation")
        public ResponseEntity<Object> getRecommendation(
                                                        @RequestParam(name = "course") String course) {
        try {
            return new ResponseEntity<Object>(studentService.getRecommendation(course),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<Object>(e.getMessage(),HttpStatus.OK);
        }

    }

}
