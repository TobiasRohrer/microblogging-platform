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
                timeDif = (timeDifSecond < 0 ? 60 - Math.abs(timeDifSecond) : timeDifSecond) + "s ago";
            } else {
                timeDif = (timeDifMinute < 0 ? 60 - Math.abs(timeDifMinute) : timeDifMinute) + "m ago";
            }
        } else {
            timeDif = (timeDifHour < 0 ? 24 - Math.abs(timeDifHour) : timeDifHour) + "h ago";
        }
        return post.getPostDate().isAfter((LocalDateTime.now().minusDays(1L))) ? timeDif
                : post.getPostDate().toLocalDate().toString();
    }
}
