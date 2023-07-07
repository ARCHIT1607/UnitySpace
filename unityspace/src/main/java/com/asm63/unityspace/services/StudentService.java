package com.asm63.unityspace.services;


import com.asm63.unityspace.mappers.StudentMapper;
import com.asm63.unityspace.models.Student;
import com.asm63.unityspace.repositories.ImageRepository;
import com.asm63.unityspace.security.AuthenticationResponse;
import com.asm63.unityspace.security.JwtHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class StudentService {

    @Autowired
    private StudentMapper studMapper;

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
    }

    public AuthenticationResponse register(Student student) throws IOException {
        Student result = studMapper.register(student);
        var jwtToken = jwtService.generateToken(student);
//        Picture img = new Picture();
//        img.setImage(ImageUtility.compressImage(student.getBytes()));
//        img.setName(file.getOriginalFilename());
//        img.setType(file.getContentType());
//        imageRepository.save(img);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public ArrayList getFriends(String userId) {
        return studMapper.getFriends(userId);
    }

    public Student findById(String id) {
        Long likeCount = 0L;
        List<String> postLikes = studMapper.getUserPostLikes(id);
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
}
