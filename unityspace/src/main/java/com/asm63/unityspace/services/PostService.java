package com.asm63.unityspace.services;

import com.asm63.unityspace.mappers.PostMapper;
import com.asm63.unityspace.mappers.StudentMapper;
import com.asm63.unityspace.models.Comment;
import com.asm63.unityspace.models.PostDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;

@Service
public class PostService {

    @Autowired
    private PostMapper postMapper;
    @Autowired
    private StudentMapper studentMapper;


    public void patchLike (Long postId, String userId) {

        PostDTO post = postMapper.findPostById(postId);
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

            }
            String convertedString = String.join(",", strList);
            System.out.println("after adding user: " + convertedString);
            post.setLikes(convertedString);
            postMapper.updatePostLike(post);
        } else {
            post.setLikes(userId);
            System.out.println("post.getLikes when there is no like " + post.getLikes());
            postMapper.updatePostLike(post);
        }
        Long likeCount = 0L;
        List<String> postLikes = postMapper.getUserPostLikes(userId);
        for(String like : postLikes){
            if(like!=null && !like.isEmpty()){
                // split string by no space
                String[] strSplit = like.split(",");

                // Now convert string into ArrayList
                ArrayList<String> strList = new ArrayList<String>(
                        Arrays.asList(strSplit));
//                System.out.println("strList "+strList);
//                System.out.println("strList size "+strList.size());
                likeCount = likeCount + strList.size();
            }
        }
        studentMapper.updateImpression(likeCount,userId);

    }

    public void createPost(PostDTO post, MultipartFile file) throws IOException {
        post.setCreatedDate(LocalDate.now().toString());
        post.setCreatedBy(post.getPostUserId());
        if (file!=null && !file.isEmpty()){
            String fileName = file.getOriginalFilename();
            byte[] data = file.getBytes();
            System.out.println("picture data "+data);

            if(data!=null) {
                post.setPicture(data);
                post.setPicturePath(fileName);
                postMapper.createPost(post);
            }

        }else{
            post.setPicture(null);
            postMapper.createPostWithoutPicture(post);
        }


    }

    public PostDTO getPost(Long id) {
        return postMapper.findPostById(id);
    }

    public ArrayList<HashMap> getPosts() {
        ArrayList<HashMap> posts = postMapper.getPosts();
        System.out.println("posts 1"+posts);
       for(HashMap post : posts){
           System.out.println("post.get(\"id\") "+post.get("id"));
           System.out.println("postMapper.findCommentByPostId(post.getId() "+postMapper.findCommentByPostId((Long) post.get("id")));

           post.put("comments",postMapper.findCommentByPostId((Long) post.get("id")));
       }
        return posts;
    }

    public ArrayList<PostDTO> getUserPosts(String userId) {
        return postMapper.getUserPosts(userId);
    }

    public InputStream getResource(String picturePath) {
        return picturePath!=null?new ByteArrayInputStream(postMapper.getResource(picturePath).getPicture()):null;
    }

    public void deletePost(String postId) {
        postMapper.deletePost(Long.parseLong(postId));
    }

    public void postComment(Long postId, String comment, String userId) {
        Comment com = new Comment();
        com.setComment(comment);
        com.setPostId(postId);
        com.setUserId(userId);
//        String postComment = postMapper.findCommentByPostId(postId);
//        PostDTO post = postMapper.findPostById(postId);
//
//        if(postComment!=null){
//            postComment = postComment.replace("{","").replace("}","").replaceAll("\"", "");
//            String[] strSplit = postComment.split(",");
//            for(String s : strSplit){
//                System.out.println("postComment.split(\",\") " + s );
//            }
//            List<String> arrlist
//                    = new ArrayList<String>(
//                    Arrays.asList(strSplit));
//            arrlist.add(comment);
//            strSplit = arrlist.toArray(strSplit);
//            for(String s : strSplit){
//                System.out.println("strSplit " + s );
//            }
//            post.setComments(strSplit);
//        }else {
//            String[] strSplit = { comment };
//            post.setComments(strSplit);
//        }
//        postMapper.postComment(post);
        postMapper.postComment(com);
    }

    public void updatePost(PostDTO post, MultipartFile picture) throws IOException {
        System.out.println("description data "+post.getDescription());
        System.out.println("picture data "+picture + post.getPicturePath());
        if (picture!=null && !picture.isEmpty()){
            String fileName = picture.getOriginalFilename();
            byte[] data = picture.getBytes();
            System.out.println("picture data "+data);

            if(data!=null) {
                post.setPicture(data);
                post.setPicturePath(fileName+ new Random(3));
                postMapper.updatePost(post);
            }

        }else{
            postMapper.updatePost(post);
        }
    }

    public Object getDashboardData() {
        HashMap map = new HashMap();
        map.put("posts",postMapper.getPosts().size());
        map.put("users",studentMapper.findAllStudent().size());
        map.put("online",studentMapper.getAllOnlineStatus().size());
        return map;

    }
}
