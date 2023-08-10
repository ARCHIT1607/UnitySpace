package com.asm63.unityspace.mappers;

import com.asm63.unityspace.models.CloudMessageDTO;
import com.asm63.unityspace.models.FriendRequestDTO;
import com.asm63.unityspace.models.Student;
import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Mapper
public interface StudentMapper {
    public Student findByEmail(String email);
    public void register(Student student);

    public Student findByFriendId(String friendId);

    public void addFriend(String studentId, String friendId);

    public ArrayList getFriends(String userId);

    Student findById(String id);





    void deleteFriend(String id, String friendId);



    void updateImpression(Long likeCount, String userId);



    void updateViewer(String userId, String sid);


    void addFirebaseToken(CloudMessageDTO message);

    String getToken(String postUserId);

    Student getUserResource(String picturePath);

    List<HashMap> findAllStudent();

    void updateOnlineStatus(boolean status, String userId);

    void deletedUserFriends(String userId);

    void deleteUser(String userId);

    ArrayList getAllOnlineStatus();

    ArrayList<String> getAllTokens();

    void sendFriendRequest(FriendRequestDTO request);

    ArrayList checkFriendRequest(String friendId);

    void updateFriendRequestStatus(String friendId);

    HashMap checkFriendRequestExists(FriendRequestDTO request);

    void deleteFriendRequest(String friendId, String senderId);
}
