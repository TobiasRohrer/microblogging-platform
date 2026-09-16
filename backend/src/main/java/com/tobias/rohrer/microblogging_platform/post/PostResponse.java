package com.tobias.rohrer.microblogging_platform.post;

import java.time.LocalDateTime;
import java.util.Objects;

public record PostResponse(
        Long id,
        String content,
        String postDate,
        Long authorId,
        String authorName,
        PostResponse parentPost,
        int likes,
        int views,
        int reposts,
        int bookmarks,
        int comments,
        boolean isLiked
) {
    public static PostResponse fromEntity(Post post, Long accountId) {
        return new PostResponse(
                post.getId(),
                post.getContent(),
                getTimeAgoMessage(post),
                post.getAuthor().getId(),
                post.getAuthor().getName(),
                post.getParentPost() == null ? null : PostResponse.fromEntity(post.getParentPost(), accountId),
                post.getLikes(),
                post.getViews(),
                post.getReposts(),
                post.getBookmarks(),
                post.getComments(),
                accountId != null && post.getLikedByAccounts().stream().anyMatch(account -> Objects.equals(account.getId(), accountId))
        );
    }

    public static String getTimeAgoMessage(Post post) {
        int timeDifHour = post.getPostDate().getHour() - LocalDateTime.now().getHour();
        int timeDifMinute = post.getPostDate().getMinute() - LocalDateTime.now().getMinute();
        int timeDifSecond = post.getPostDate().getSecond() - LocalDateTime.now().getSecond();
        String timeDif = "";
        if (timeDifHour == 0) {
            if (timeDifMinute == 0) {
                timeDif = (timeDifSecond < 0 ? LocalDateTime.now().getSecond() - post.getPostDate().getSecond() : (60 - post.getPostDate().getSecond()) + LocalDateTime.now().getSecond()) + "s ago";
            } else {
                timeDif = (timeDifMinute < 0 ? LocalDateTime.now().getMinute() - post.getPostDate().getMinute() : (60 - post.getPostDate().getMinute()) + LocalDateTime.now().getMinute()) + "m ago";
            }
        } else {
            timeDif = (timeDifHour < 0 ? LocalDateTime.now().getHour() - post.getPostDate().getHour() : (24 - post.getPostDate().getHour()) + LocalDateTime.now().getHour()) + "h ago";
        }
        return post.getPostDate().isAfter((LocalDateTime.now().minusDays(1L))) ? timeDif
                : post.getPostDate().toLocalDate().toString();
    }
}
