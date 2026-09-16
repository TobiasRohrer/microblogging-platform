package com.tobias.rohrer.microblogging_platform.post;

import com.tobias.rohrer.microblogging_platform.account.AccountRepository;
import com.tobias.rohrer.microblogging_platform.account.Account;
import com.tobias.rohrer.microblogging_platform.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final AccountRepository accountRepository;

    public PostService(PostRepository postRepository, AccountRepository accountRepository) {
        this.postRepository = postRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public PostResponse createPost(CreatePostRequest request, Long authorId) {
        Account author = accountRepository.getReferenceById(authorId);
        Post post = new Post(author, request.getContent());
        Post savedPost = postRepository.save(post);
        return PostResponse.fromEntity(savedPost, authorId);
    }

    @Transactional(readOnly = true)
    public PostResponse getPost(Long id, Long viewerId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        return PostResponse.fromEntity(post, viewerId);
    }

    @Transactional
    public void deletePost(Long postId, Long requesterId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        if (!post.getAuthor().getId().equals(requesterId)) {
            throw new AccessDeniedException("You are not authorized to delete this post");
        }
        postRepository.delete(post);
    }

    @Transactional
    public PostResponse likePost(Long postId, Long accountId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));
        post.addLike(account);
        return PostResponse.fromEntity(post, accountId);
    }

    @Transactional
    public PostResponse unlikePost(Long postId, Long accountId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));
        post.removeLike(account);
        return PostResponse.fromEntity(post, accountId);
    }

    @Transactional
    public PostResponse createComment(Long parentPostId, CreatePostRequest request, Long authorId) {
        Post parent = postRepository.findById(parentPostId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent post not found with id: " + parentPostId));
        Account author = accountRepository.getReferenceById(authorId);

        Post comment = new Post(author, request.getContent());
        comment.setParentPost(parent);
        parent.addComment();

        Post savedComment = postRepository.save(comment);
        return PostResponse.fromEntity(savedComment, authorId);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getComments(Long postId, Long viewerId) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id: " + postId);
        }
        return postRepository.findByParentPostId(postId).stream()
                .map(comment -> PostResponse.fromEntity(comment, viewerId))
                .toList();
    }
}
