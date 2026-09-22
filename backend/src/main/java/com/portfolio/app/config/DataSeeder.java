package com.portfolio.app.config;

import com.portfolio.app.entity.AdminUser;
import com.portfolio.app.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates the initial local admin account on first startup, using credentials
 * from environment variables, so you never hardcode a password in source.
 * If the username already exists, this does nothing.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment environment;

    @Value("${app.admin.default-username}")
    private String defaultUsername;

    @Value("${app.admin.default-password}")
    private String defaultPassword;

    @Value("${app.admin.default-email}")
    private String defaultEmail;

    @Override
    public void run(String... args) {
    	String dbUrl = environment.getProperty("spring.datasource.url");
    	System.out.println("------------------------------------------------------------------");
    	System.out.println(dbUrl);
    	System.out.println("------------------------------------------------------------------");
        if (!adminUserRepository.existsByUsername(defaultUsername)) {
            AdminUser admin = AdminUser.builder()
                    .username(defaultUsername)
                    .password(passwordEncoder.encode(defaultPassword))
                    .email(defaultEmail)
                    .fullName("Admin")
                    .provider("LOCAL")
                    .role("ROLE_ADMIN")
                    .enabled(true)
                    .build();
            adminUserRepository.save(admin);
            System.out.println(">>> Seeded initial admin user: " + defaultUsername);
        }
    }
}
