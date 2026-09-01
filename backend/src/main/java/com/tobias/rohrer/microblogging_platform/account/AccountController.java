package com.tobias.rohrer.microblogging_platform.account;

import com.tobias.rohrer.microblogging_platform.auth.UserPrincipal;
import com.tobias.rohrer.microblogging_platform.post.PostResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    AccountService accountService;

    @PostMapping("/register")
    public ResponseEntity<AccountResponse> register(@Valid @RequestBody CreateAccountRequest request) {
        AccountResponse account = accountService.register(request);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/accounts/{username}")
                .buildAndExpand(account.name())
                .toUri();
        return ResponseEntity.created(uri).body(account);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(accountService.login(request));
    }

    @GetMapping("/{username}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable String username, @AuthenticationPrincipal UserPrincipal principal) {
        AccountResponse account = accountService.getAccountByUsername(username, principal);
        return ResponseEntity.ok(account);
    }

    @GetMapping()
    public ResponseEntity<List<AccountResponse>> getAccounts(@AuthenticationPrincipal UserPrincipal principal) {
        List<AccountResponse> accounts = accountService.getAccounts(principal);
        return ResponseEntity.ok(accounts);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{username}/followers")
    public ResponseEntity<FollowResponse> followAccount(@PathVariable String username, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(accountService.follow(username, principal.getId()));
    }

    @DeleteMapping("/{username}/followers")
    public ResponseEntity<FollowResponse> unfollowAccount(@PathVariable String username, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(accountService.unfollow(username, principal.getId()));
    }

    @GetMapping("/home")
    public ResponseEntity<List<PostResponse>> getTimeLine(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(accountService.getTimeLine(principal.getId()));
    }

    @GetMapping("/{username}/isFollowing")
    public ResponseEntity<FollowResponse> isFollowing(@AuthenticationPrincipal UserPrincipal principal, @PathVariable String username) {
        return ResponseEntity.ok(accountService.isFollowing(username, principal));
    }

    @GetMapping("/{username}/followers")
    public ResponseEntity<List<AccountResponse>> getFollowers(@PathVariable String username, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(accountService.getFollowers(username, principal));
    }

    @GetMapping("/{username}/following")
    public ResponseEntity<List<AccountResponse>> getFollowing(@PathVariable String username, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(accountService.getFollowing(username, principal));
    }

    @GetMapping("/me")
    public ResponseEntity<String> getMyUsername(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(accountService.getAccountByEmail(principal.getUsername(), principal).name());
    }
}
