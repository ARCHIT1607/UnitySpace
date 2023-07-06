package com.asm63.unityspace.services;

import com.asm63.unityspace.mappers.StudentMapper;
import com.asm63.unityspace.models.PostDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;

@Service
public class PostService {

    @Autowired
    private StudentMapper studentMapper;

    public void patchLike (Long postId, String userId) {

        PostDTO post = studentMapper.findPostById(postId);
        if (post.getLikes()!= null && post.getLikes().length()>4) {
            String like = post.getLikes();
            // split string by no space
            String[] strSplit = like.split(",");

            // Now convert string into ArrayList
            ArrayList<String> strList = new ArrayList<String>(
                    Arrays.asList(strSplit));
            System.out.println("strList "+strList);
            System.out.println("strList size "+strList.size());
            if(strList!=null && !strList.isEmpty()){
                if(strList.contains(userId)){
                    System.out.println("strList.contains(userId) "+strList.contains(userId));
                    strList.remove(userId);
                }
                else{
                    System.out.println("strList.contains(userId) not  "+strList.contains(userId) );
                    strList.add(userId);
                }
//                ListIterator<String> iterator = strList.listIterator();
//                System.out.println("iterator "+iterator);
//                while (iterator.hasNext()) {
//                    String user = iterator.next();
//                    if (user.equals(userId)) {
//                        System.out.println("inside user.equal in iterator user "+user +" userId "+userId);
//                        iterator.remove();
//                        break;
//                    } else {
//                        System.out.println("inside user not equal in iterator user "+user +" userId "+userId);
//                        iterator.add(userId);
//                    }
//                }

            }
            String convertedString = String.join(",", strList);
//            String updatedLikes = like+","+userId;
            System.out.println("after adding user: " + convertedString);
            post.setLikes(convertedString);
            studentMapper.updatePost(post);
        } else {
            post.setLikes(userId);
            System.out.println("post.getLikes when there is no like " + post.getLikes());
            studentMapper.updatePost(post);
        }

    }

    public void createPost(PostDTO post, MultipartFile file) throws IOException {
//        System.out.println("file!=null" +file!=null + " file.isEmpty() "+file.isEmpty());
        if (file!=null && !file.isEmpty()){
            String fileName = file.getOriginalFilename();
            byte[] data = file.getBytes();
            post.setPicture(data);
            post.setPicturePath(fileName);
        }
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

    public InputStream getResource(String picturePath) {
        return new ByteArrayInputStream(studentMapper.getResource(picturePath).getPicture());
    }

    public void deletePost(String postId) {
        studentMapper.deletePost(Long.parseLong(postId));
    }
}
