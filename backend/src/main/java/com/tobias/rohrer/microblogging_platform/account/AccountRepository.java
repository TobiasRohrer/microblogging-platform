package com.tobias.rohrer.microblogging_platform.account;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByEmail(String email);

    Optional<Account> findByName(String name);

    @Query(value = """
        SELECT 
            a.name AS name,
            EXISTS (
                SELECT 1 
                FROM account_followers af 
                WHERE af.follower_id = :currentAccountId 
                  AND af.account_id = a.id
            ) AS isFollowing
        FROM accounts a
        WHERE 
            a.id != :currentAccountId
            AND a.name ILIKE '%' || :query || '%'
        ORDER BY (
            CASE 
                WHEN a.name ILIKE :query || '%' THEN 1.0 
                ELSE 0.3 
            END
            + similarity(a.name, :query)
            + CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM account_followers af 
                    WHERE af.follower_id = :currentAccountId 
                      AND af.account_id = a.id
                ) THEN 0.5 
                ELSE 0.0 
              END
        ) DESC
        """, nativeQuery = true)
    List<UserSearchResponse> searchForDropdown(
            @Param("query") String query,
            @Param("currentAccountId") Long currentAccountId,
            Pageable pageable
    );
}
