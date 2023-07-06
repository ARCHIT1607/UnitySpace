package com.asm63.unityspace.mappers;

import com.asm63.unityspace.models.PostDTO;
import com.asm63.unityspace.models.Student;
import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;

@Mapper
public interface StudentMapper {
    public Student findByEmail(String email);
    public Student register(Student student);

    public Student findByFriendId(String friendId);

    public void addFriend(String studentId, String friendId);

    public ArrayList getFriends(String userId);

    Student findById(String id);

    PostDTO findPostById(Long id);

    void updatePost(PostDTO like);

    void createPost(PostDTO post);

    ArrayList<PostDTO> getPosts();

    ArrayList<PostDTO> getUserPosts(String userId);

    ArrayList<String> getLikes(Long postId);

    void deleteFriend(String id, String friendId);

    PostDTO getResource(String picturePath);

    void deletePost(Long postId);
}
