package com.tobias.rohrer.microblogging_platform.account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CreateAccountRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    public CreateAccountRequest(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public CreateAccountRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
