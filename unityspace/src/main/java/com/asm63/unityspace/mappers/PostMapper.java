package com.asm63.unityspace.mappers;


import com.asm63.unityspace.models.Comment;
import com.asm63.unityspace.models.Events;
import com.asm63.unityspace.models.PostDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Mapper
public interface PostMapper {

    PostDTO findPostById(Long id);

    void updatePostLike(PostDTO post);

    void createPost(PostDTO post);

    ArrayList<HashMap> getPosts();

    ArrayList<PostDTO> getUserPosts(String userId);

    PostDTO getResource(String picturePath);

    void deletePost(Long postId);

    void postComment(Comment comment);

    ArrayList<String> findCommentByPostId(Long postId);

    List<String> getUserPostLikes(String userId);

    ArrayList<Events> getEvents();

    ArrayList<String> getLikes(Long postId);

    void createPostWithoutPicture(PostDTO post);

    void deletedUserPost(String userId);

    void inActiveEvent(Long id);

    void updateDaysLeft(Long id, String daysLeft);

    void updatePost(PostDTO post);

    void createEvent(Events event);

    void deleteEvent(Long id);

    ArrayList<Comment> geComment(Long id);
}
