package com.tobias.rohrer.microblogging_platform.account;

import com.tobias.rohrer.microblogging_platform.auth.JWTService;
import com.tobias.rohrer.microblogging_platform.auth.UserPrincipal;
import com.tobias.rohrer.microblogging_platform.exception.ResourceNotFoundException;
import com.tobias.rohrer.microblogging_platform.post.Post;
import com.tobias.rohrer.microblogging_platform.post.PostRepository;
import com.tobias.rohrer.microblogging_platform.post.PostResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final PostRepository postRepository;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AccountService(AccountRepository accountRepository,
                          PostRepository postRepository,
                          AuthenticationManager authenticationManager,
                          JWTService jwtService,
                          PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.postRepository = postRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public AccountResponse register(CreateAccountRequest request) {
        Optional<Account> account = accountRepository.findByEmail(request.getEmail());
        Optional<Account> account1 = accountRepository.findByName(request.getUsername());
        if (account.isPresent()) {
            throw new IllegalArgumentException("Account with this email already exists");
        }
        if (account1.isPresent()) {
            throw new IllegalArgumentException("Account with this username already exists");
        }
        return AccountResponse.fromEntity(accountRepository.save(new Account(
                request.getUsername(), request.getEmail(), passwordEncoder.encode(request.getPassword()))), null);
    }

    public List<AccountResponse> getAccounts(UserPrincipal principal) {
        List<Account> accounts = accountRepository.findAll();
        return accounts.stream().map(account -> AccountResponse.fromEntity(account, principal.getId())).toList();
    }

    public void deleteAccount(Long id) {
        Optional<Account> delAccount = accountRepository.findById(id);
        if (delAccount.isPresent()) {
            accountRepository.deleteById(delAccount.get().getId());
        } else {
            throw new ResourceNotFoundException("Account not found with this id: " + id);
        }
    }

    public AccountResponse getAccountByUsername(String username, UserPrincipal principal) {
        return AccountResponse.fromEntity(accountRepository.findByName(username).orElseThrow(
                () -> new ResourceNotFoundException("Account not found with this username: " + username)), principal.getId());
    }

    public AccountResponse getAccountByEmail(String email, UserPrincipal principal) {
        return AccountResponse.fromEntity(accountRepository.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("Account not found with this email: " + email)), principal.getId());
    }

    public String verify(LoginRequest request) {
        Authentication authentication =
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(request.getEmail());
        }
        throw new UsernameNotFoundException("Password or Email was not correct");
    }

    public LoginResponse login(LoginRequest request) {
        String token = verify(request);
        Account account = accountRepository.findByEmail(request.getEmail()).orElseThrow(
                () -> new ResourceNotFoundException("Target account not found with email: " + request.getEmail()));
        return new LoginResponse(token, account.getName());
    }

    @Transactional
    public FollowResponse follow(String username, Long followerId) {
        Account toFollow = accountRepository.findByName(username).orElseThrow(
                () -> new ResourceNotFoundException("Target account not found with username: " + username));
        Account follower = accountRepository.findById(followerId).orElseThrow(
                () -> new ResourceNotFoundException("Follower account not found with id: " + followerId));
        toFollow.addFollower(follower);
        return new FollowResponse(true);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getTimeLine(Long accountId) {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Post> posts = postRepository.findTimelinePosts(accountId, sevenDaysAgo);

        return posts.stream()
                .map(post -> PostResponse.fromEntity(post, accountId))
                .toList();
    }

    public FollowResponse isFollowing(String username, UserPrincipal principal) {
        Account toFollow = accountRepository.findByName(username).orElseThrow(
                () -> new ResourceNotFoundException("Target account not found with username: " + username));
        return new FollowResponse(toFollow.getFollowers().stream().anyMatch(account -> Objects.equals(account.getId(), principal.getId())));
    }

    @Transactional
    public FollowResponse unfollow(String username, Long followerId) {
        Account toFollow = accountRepository.findByName(username).orElseThrow(
                () -> new ResourceNotFoundException("Target account not found with username: " + username));
        Account follower = accountRepository.findById(followerId).orElseThrow(
                () -> new ResourceNotFoundException("Follower account not found with id: " + followerId));
        toFollow.removeFollower(follower);
        return new FollowResponse(false);
    }

    @Transactional(readOnly = true)
    public List<AccountResponse> getFollowers(String username, UserPrincipal principal) {
        Account account = accountRepository.findByName(username).orElseThrow(
                () -> new ResourceNotFoundException("Account not found with username: " + username)
        );
        return account.getFollowers().stream().map(account1 -> AccountResponse.fromEntity(account1, principal.getId())).toList();
    }

    @Transactional(readOnly = true)
    public List<AccountResponse> getFollowing(String username, UserPrincipal principal) {
        Account account = accountRepository.findByName(username).orElseThrow(
                () -> new ResourceNotFoundException("Account not found with username: " + username)
        );
        return account.getFollowing().stream().map(account1 -> AccountResponse.fromEntity(account1, principal.getId())).toList();
    }

    public List<UserSearchResponse> search(String searchTerm, UserPrincipal principal) {
        if (searchTerm.trim().length() < 2) {
            throw new IllegalArgumentException("Searched username has to be at least 2 digits long");
        }
        return accountRepository.searchForDropdown(searchTerm, principal.getId(), PageRequest.of(0,8));
    }
}
