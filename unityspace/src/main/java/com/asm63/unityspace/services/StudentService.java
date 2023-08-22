package com.asm63.unityspace.services;


import com.asm63.unityspace.mappers.PostMapper;
import com.asm63.unityspace.mappers.StudentMapper;
import com.asm63.unityspace.models.Events;
import com.asm63.unityspace.models.FriendRequestDTO;
import com.asm63.unityspace.models.Student;
import com.asm63.unityspace.repositories.ImageRepository;
import com.asm63.unityspace.security.AuthenticationResponse;
import com.asm63.unityspace.security.JwtHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class StudentService {

    @Autowired
    private StudentMapper studMapper;

    @Autowired
    private PostMapper postMapper;

    @Autowired
    ImageRepository imageRepository;

    @Autowired
    private JwtHelper jwtService;

    public Map<String, String> authenticate(Student request) throws Exception {
        Student user = studMapper.findByEmail(request.getEmail());
        user.setFriends(studMapper.getFriends(user.getSid()));
        if(user==null) {
            throw new Exception("user not found");
        }
        var jwtToken = jwtService.generateToken(user);
        AuthenticationResponse authenticateResponse = AuthenticationResponse.builder().token(jwtToken).build();
        Map result = new HashMap();
        result.put("token",authenticateResponse);
        result.put("user",user);
        return result;
    }

    public Student findByEmail(String email) {
        return studMapper.findByEmail(email);
    }

    public Student findByFriendId(String friendId){
        return studMapper.findByFriendId(friendId);
    }

    public void addFriend(String studentId, String friendId){
        studMapper.addFriend(studentId, friendId);
        studMapper.addFriend(friendId, studentId);
        studMapper.updateFriendRequestStatus(friendId);
    }

    public AuthenticationResponse register(Student student, MultipartFile file) throws IOException {
        if (file!=null && !file.isEmpty()){
            String fileName = file.getOriginalFilename();
            byte[] data = file.getBytes();
            student.setProfilePic(data);
            student.setPictureName(fileName+ new Random(3));
        }
        studMapper.register(student);
        var jwtToken = jwtService.generateToken(student);

        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public ArrayList getFriends(String userId) {
            return studMapper.getFriends(userId);
    }


    public Student findById(String id) {
        Long likeCount = 0L;
        List<String> postLikes = postMapper.getUserPostLikes(id);
        for(String like : postLikes){
            if(like!=null && !like.isEmpty()){
                // split string by no space
                String[] strSplit = like.split(",");

                // Now convert string into ArrayList
                ArrayList<String> strList = new ArrayList<String>(
                        Arrays.asList(strSplit));
                System.out.println("strList "+strList);
                System.out.println("strList size "+strList.size());
                likeCount = likeCount + strList.size();
            }
        }
        studMapper.updateImpression(likeCount,id);
        Student student = studMapper.findById(id);
        student.setFriends(studMapper.getFriends(id));
        return student;
    }

    public void deleteFriend(String id, String friendId) {
        studMapper.deleteFriend(id,friendId);
    }

    public void updateViewer(String userId, String sid) {
        studMapper.updateViewer(userId,sid);
    }

    public ArrayList<Events> getEvents() {
        ArrayList<Events> events = postMapper.getEvents();
        for(Events event : events){
            LocalDate inputDate = LocalDate.parse(event.getEventDate());
            LocalDate currentDate = LocalDate.now();
            long diffDays = ChronoUnit.DAYS.between(currentDate, inputDate);
            int days = Math.round((int) diffDays);
            if(days<0) {
                postMapper.inActiveEvent(event.getId());
            }
            event.setDaysLeft(String.valueOf(days));
            postMapper.updateDaysLeft(event.getId(),String.valueOf(days));
        }

        return postMapper.getEvents();
    }

    public InputStream getResource(String picturePath) {
        System.out.println("picturePath "+picturePath);
        Student stu = studMapper.getUserResource(picturePath);
        return new ByteArrayInputStream(stu.getProfilePic());
    }


    public List<HashMap> findAllStudent() {
        return studMapper.findAllStudent();
    }

    public void updateOnlineStatus(boolean status, String userId) {
        studMapper.updateOnlineStatus(status, userId);
    }

    public void deleteUser(String userId) {
        postMapper.deletedUserPost(userId);
        studMapper.deletedUserFriends(userId);
        studMapper.deleteUser(userId);
    }

    public void sendFriendRequest(FriendRequestDTO request) {
        studMapper.sendFriendRequest(request);
    }

    public ArrayList checkFriendRequest(String friendId) {
        return studMapper.checkFriendRequest(friendId);
    }

    public HashMap checkFriendRequestExists(FriendRequestDTO request) {
        return studMapper.checkFriendRequestExists(request);
    }

    public String deleteFriendRequest(String friendId, String senderId) {
        studMapper.deleteFriendRequest(friendId,senderId);
        return "Friend Request deleted successfully";
    }
}
