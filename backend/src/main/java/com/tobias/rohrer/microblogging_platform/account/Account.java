package com.tobias.rohrer.microblogging_platform.account;

import com.tobias.rohrer.microblogging_platform.post.Post;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToMany(mappedBy = "author")
    private Set<Post> posts = new HashSet<>();
    @ManyToMany
    @JoinTable(
            name = "account_followers",
            joinColumns = @JoinColumn(name = "account_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id")
    )
    private Set<Account> followers = new HashSet<>();
    @ManyToMany(mappedBy = "followers")
    private Set<Account> following = new HashSet<>();
    private LocalDateTime creationDate;
    @Column(unique = true, nullable = false)
    private String name;
    private String password;
    @Column(unique = true, nullable = false)
    private String email;
    @ManyToMany(mappedBy = "likedByAccounts")
    private Set<Post> likedPosts = new HashSet<>();

    public Account(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.creationDate = LocalDateTime.now();
    }

    public Account() {

    }

    public void addPost(Post post) {
        posts.add(post);
        post.setAuthor(this);
    }

    public void removePost(Post post) {
        posts.remove(post);
        post.setAuthor(null);
    }

    public Account addFollower(Account follower) {
        this.getFollowers().add(follower);
        follower.getFollowing().add(this);
        return this;
    }

    public Account removeFollower(Account follower) {
        this.getFollowers().remove(follower);
        follower.getFollowing().remove(this);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Account account)) return false;
        return Objects.equals(email, account.email);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(email);
    }

    public Set<Post> getLikedPosts() {
        return likedPosts;
    }

    public void setLikedPosts(Set<Post> likedPosts) {
        this.likedPosts = likedPosts;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Post> getPosts() {
        return posts;
    }

    public void setPosts(Set<Post> posts) {
        this.posts = posts;
    }

    public Set<Account> getFollowers() {
        return followers;
    }

    public void setFollowers(Set<Account> followers) {
        this.followers = followers;
    }

    public Set<Account> getFollowing() {
        return following;
    }

    public void setFollowing(Set<Account> following) {
        this.following = following;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }
}
