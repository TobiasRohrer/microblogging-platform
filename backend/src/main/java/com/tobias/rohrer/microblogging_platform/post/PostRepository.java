package com.tobias.rohrer.microblogging_platform.post;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByParentPostId(Long parentPostId);
    @Query("""
    SELECT p FROM Post p 
    WHERE p.author IN (
        SELECT f FROM Account a JOIN a.following f WHERE a.id = :accountId
    ) 
    AND p.parentPost IS NULL 
    AND p.postDate >= :since
    ORDER BY p.postDate DESC
""")
    List<Post> findTimelinePosts(@Param("accountId") Long accountId, @Param("since") LocalDateTime since);
}
