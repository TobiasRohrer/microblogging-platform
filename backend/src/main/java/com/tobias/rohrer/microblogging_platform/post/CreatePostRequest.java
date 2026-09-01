package com.tobias.rohrer.microblogging_platform.post;

public class CreatePostRequest {

    private String content;

    public CreatePostRequest(String content) {
        this.content = content;
    }

    public CreatePostRequest() {
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
