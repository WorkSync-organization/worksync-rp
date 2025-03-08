package com.example.worksync.service;

import com.example.worksync.dto.requests.CommentDTO;
import com.example.worksync.model.Comment;
import com.example.worksync.model.Task;
import com.example.worksync.model.User;
import com.example.worksync.repository.CommentRepository;
import com.example.worksync.repository.TaskRepository;
import com.example.worksync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.worksync.exceptions.ResourceNotFoundException;
import com.example.worksync.exceptions.UnauthorizedAccessException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CommentDTO> listCommentsByTask(Long taskId) {
        List<Comment> comments = commentRepository.findByTaskId(taskId);
        return comments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CommentDTO addComment(CommentDTO commentDTO) {
        Optional<Task> taskOpt = taskRepository.findById(commentDTO.getTaskId());
        Optional<User> userOpt = userRepository.findById(commentDTO.getUserId());

        if (taskOpt.isEmpty() || userOpt.isEmpty()) {
            throw new RuntimeException("Task or User not found!");
        }

        Comment comment = new Comment();
        comment.setDescription(commentDTO.getDescription());
        comment.setTask(taskOpt.get());
        comment.setUser(userOpt.get());
        comment.setCreatedAt(LocalDateTime.now());

        comment = commentRepository.save(comment);
        return convertToDTO(comment);
    }

    private CommentDTO convertToDTO(Comment comment) {
        return new CommentDTO(
                comment.getId(),
                comment.getDescription(),
                comment.getTask().getId(),
                comment.getUser().getId(),
                comment.getCreatedAt()
        );
    }

    public void deleteComment(Long commentId, User user) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        
        if (commentOpt.isEmpty()) {
            throw new ResourceNotFoundException("Comment", commentId);
        }

        Comment comment = commentOpt.get();
        
        
        if (!comment.getUser().equals(user)) {
            throw new UnauthorizedAccessException("You are not authorized to delete this comment.");
        }

        commentRepository.delete(comment);
    }
}
