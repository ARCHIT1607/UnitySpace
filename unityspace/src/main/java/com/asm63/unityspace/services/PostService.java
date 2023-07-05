package com.asm63.unityspace.services;

import com.asm63.unityspace.mappers.StudentMapper;
import com.asm63.unityspace.models.PostDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;

@Service
public class PostService {

    @Autowired
    private StudentMapper studentMapper;

    public void patchLike (Long postId, String userId) {

        PostDTO post = studentMapper.findPostById(postId);
        if (post.getLikes()!= null) {
            String like = post.getLikes();
            // split string by no space
            String[] strSplit = like.split(",");

            // Now convert string into ArrayList
            ArrayList<String> strList = new ArrayList<String>(
                    Arrays.asList(strSplit));
            System.out.println("strList "+strList);
            for(String user : strList){
                if(user.equals(userId)){
                    strList.remove(user);
                }else{
                    strList.add(user);
                }
            }
            String convertedString = String.join(", ", strList);
//            String updatedLikes = like+","+userId;
            System.out.println("after adding user: " + convertedString);
            post.setLikes(convertedString);
            studentMapper.updatePost(post);
        } else {
            post.setLikes(userId);
            studentMapper.updatePost(post);
        }

    }

    public void createPost(PostDTO post) {

        studentMapper.createPost(post);
    }

    public PostDTO getPost(Long id) {
//        return studentMapper.findPostById(id);
        return new PostDTO();
    }

    public ArrayList<PostDTO> getPosts() {
        return studentMapper.getPosts();
    }

    public ArrayList<PostDTO> getUserPosts(String userId) {
        return studentMapper.getUserPosts(userId);
    }
}
