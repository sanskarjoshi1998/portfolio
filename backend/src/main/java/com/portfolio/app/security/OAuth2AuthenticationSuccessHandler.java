package com.portfolio.app.security;

import com.portfolio.app.entity.AdminUser;
import com.portfolio.app.repository.AdminUserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Set;

/**
 * Triggered after a successful Google OAuth2 login.
 * Only emails present in app.admin.allowed-emails are granted admin access;
 * everyone else is rejected even though Google authenticated them successfully.
 * Issues our own JWT and redirects back to the Angular frontend with the token.
 */
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final AdminUserRepository adminUserRepository;

    @Value("${app.oauth2.authorized-redirect-uri}")
    private String redirectUri;

    @Value("#{'${app.admin.allowed-emails}'.split(',')}")
    private Set<String> allowedAdminEmails;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                         Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        if (email == null || !allowedAdminEmails.contains(email.trim())) {
            // Not an authorized admin email - deny access even though Google login succeeded
            getRedirectStrategy().sendRedirect(request, response, redirectUri + "?error=not_authorized");
            return;
        }

        // Find or create the local AdminUser record tied to this Google account
        AdminUser adminUser = adminUserRepository.findByEmail(email)
                .orElseGet(() -> adminUserRepository.save(
                        AdminUser.builder()
                                .username(email)
                                .email(email)
                                .fullName(name)
                                .password(null)
                                .provider("GOOGLE")
                                .role("ROLE_ADMIN")
                                .enabled(true)
                                .build()
                ));

        String token = jwtUtil.generateToken(adminUser.getUsername(), adminUser.getRole());

        getRedirectStrategy().sendRedirect(request, response, redirectUri + "?token=" + token);
    }
}
