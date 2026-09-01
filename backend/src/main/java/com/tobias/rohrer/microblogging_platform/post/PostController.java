package com.tobias.rohrer.microblogging_platform.post;

import com.tobias.rohrer.microblogging_platform.auth.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody CreatePostRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        PostResponse post = postService.createPost(request, principal.getId());
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(post.id())
                .toUri();
        return ResponseEntity.created(uri).body(post);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(postService.getPost(id, principal.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        postService.deletePost(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<PostResponse> likePost(@PathVariable Long postId, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(postService.likePost(postId, principal.getId()));
    }

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<PostResponse> unlikePost(@PathVariable Long postId, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(postService.unlikePost(postId, principal.getId()));
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<PostResponse> createComment(@PathVariable Long postId, @Valid @RequestBody CreatePostRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        PostResponse response = postService.createComment(postId, request, principal.getId());
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/api/posts/{id}")
                .buildAndExpand(principal.getUsername(), response.id())
                .toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<PostResponse>> getComments(@PathVariable Long postId, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(postService.getComments(postId, principal.getId()));
    }
}
