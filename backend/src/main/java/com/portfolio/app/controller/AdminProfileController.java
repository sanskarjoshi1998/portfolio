package com.portfolio.app.controller;

import com.portfolio.app.entity.Profile;
import com.portfolio.app.repository.ProfileRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
public class AdminProfileController {

    private final ProfileRepository profileRepository;

    @GetMapping
    public ResponseEntity<Profile> getProfile() {
        return profileRepository.findAll().stream()
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    /** Creates the profile if none exists yet, or updates the existing one (upsert). */
    @PutMapping
    public ResponseEntity<Profile> upsertProfile(@Valid @RequestBody Profile profile) {
        Profile existing = profileRepository.findAll().stream().findFirst().orElse(null);

        if (existing != null) {
            profile.setId(existing.getId());
        }

        Profile saved = profileRepository.save(profile);
        return ResponseEntity.ok(saved);
    }
}
