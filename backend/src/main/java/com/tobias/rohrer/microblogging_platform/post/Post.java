package com.tobias.rohrer.microblogging_platform.post;

import com.tobias.rohrer.microblogging_platform.account.Account;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private Account author;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_post_id")
    private Post parentPost;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "post_likes",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id")
    )
    private Set<Account> likedByAccounts = new HashSet<>();
    private LocalDateTime postDate;
    private String content;
    private int likes, views, reposts, bookmarks, comments;

    public Post(Account author, String content) {
        this.author = author;
        this.postDate = LocalDateTime.now();
        this.content = content;
        this.likes = 0;
        this.bookmarks = 0;
        this.views = 0;
        this.reposts = 0;
        this.comments = 0;
        this.parentPost = null;
    }

    public Post() {

    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Post post)) return false;
        return Objects.equals(id, post.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    public Post addLike(Account account) {
        if (likedByAccounts.add(account)) {
            account.getLikedPosts().add(this);
            this.likes++;
        }
        return this;
    }

    public Post removeLike(Account account) {
        if (likedByAccounts.remove(account)) {
            account.getLikedPosts().remove(this);
            this.likes = Math.max(0, this.likes - 1);
        }
        return this;
    }

    public int getComments() {
        return this.comments;
    }

    public int addComment() {
        return ++comments;
    }

    public Set<Account> getLikedByAccounts() {
        return likedByAccounts;
    }

    public void setLikedByAccounts(Set<Account> likedByAccounts) {
        this.likedByAccounts = likedByAccounts;
    }

    public Post getParentPost() {
        return parentPost;
    }

    public void setParentPost(Post parentPost) {
        this.parentPost = parentPost;
    }

    public Account getAuthor() {
        return author;
    }

    public void setAuthor(Account author) {
            this.author = author;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getPostDate() {
        return postDate;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public int getReposts() {
        return reposts;
    }

    public void setReposts(int reposts) {
        this.reposts = reposts;
    }

    public int getBookmarks() {
        return bookmarks;
    }

    public void setBookmarks(int bookmarks) {
        this.bookmarks = bookmarks;
    }
}
