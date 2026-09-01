package com.tobias.rohrer.microblogging_platform.account;

import com.tobias.rohrer.microblogging_platform.post.PostResponse;

import java.util.List;

public record AccountResponse(
        Long id,
        String name,
        String email,
        int followersCount,
        int followingCount,
        List<PostResponse> posts
) {
    public static AccountResponse fromEntity(Account account, Long userId) {
        return new AccountResponse(
                account.getId(),
                account.getName(),
                account.getEmail(),
                account.getFollowers().size(),
                account.getFollowing().size(),
                account.getPosts().stream().map(post -> PostResponse.fromEntity(post, userId)).toList()
        );
    }
}