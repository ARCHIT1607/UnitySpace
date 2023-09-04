package com.asm63.unityspace.services;

import com.asm63.unityspace.mappers.StudentMapper;
import com.asm63.unityspace.models.CloudMessageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FirebaseService {

    @Autowired
    private StudentMapper studentMapper;

    public void addFirebaseToken(CloudMessageDTO message) {
        studentMapper.addFirebaseToken(message);
    }

    public String getToken(String postUserId) {
        return studentMapper.getToken(postUserId);
    }

}
