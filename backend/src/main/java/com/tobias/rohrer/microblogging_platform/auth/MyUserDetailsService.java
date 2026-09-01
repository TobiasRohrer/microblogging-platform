package com.tobias.rohrer.microblogging_platform.auth;

import com.tobias.rohrer.microblogging_platform.account.Account;
import com.tobias.rohrer.microblogging_platform.account.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private AccountRepository repo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Account> account = repo.findByEmail(email);
        if (account.isEmpty()) {
            System.out.println("Account not found!");
            throw new UsernameNotFoundException("Account not found!");
        }
        return new UserPrincipal(account.get());
    }
}
