package com.tobias.rohrer.microblogging_platform.account;

public record LoginResponse(String jwtToken, String username) {}
