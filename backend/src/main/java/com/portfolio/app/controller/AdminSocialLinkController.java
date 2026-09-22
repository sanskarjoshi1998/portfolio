package com.portfolio.app.controller;

import com.portfolio.app.entity.SocialLink;
import com.portfolio.app.repository.SocialLinkRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/social-links")
@RequiredArgsConstructor
public class AdminSocialLinkController {

    private final SocialLinkRepository socialLinkRepository;

    @GetMapping
    public List<SocialLink> getAll() {
        return socialLinkRepository.findAll();
    }

    @PostMapping
    public SocialLink create(@Valid @RequestBody SocialLink socialLink) {
        socialLink.setId(null);
        return socialLinkRepository.save(socialLink);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SocialLink> update(@PathVariable Long id, @Valid @RequestBody SocialLink socialLink) {
        if (!socialLinkRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        socialLink.setId(id);
        return ResponseEntity.ok(socialLinkRepository.save(socialLink));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!socialLinkRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        socialLinkRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
