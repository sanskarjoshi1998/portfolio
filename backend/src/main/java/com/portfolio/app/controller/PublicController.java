package com.portfolio.app.controller;

import com.portfolio.app.entity.*;
import com.portfolio.app.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public, unauthenticated endpoints. These power the visitor-facing
 * portfolio website (resume view) and the contact form.
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final ProfileRepository profileRepository;
    private final EducationRepository educationRepository;
    private final ExperienceRepository experienceRepository;
    private final CertificationRepository certificationRepository;
    private final SkillRepository skillRepository;
    private final SocialLinkRepository socialLinkRepository;
    private final ContactMessageRepository contactMessageRepository;

    @GetMapping("/profile")
    public ResponseEntity<Profile> getProfile() {
        return profileRepository.findAll().stream()
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/education")
    public List<Education> getEducation() {
        return educationRepository.findAll();
    }

    @GetMapping("/experience")
    public List<Experience> getExperience() {
        return experienceRepository.findAll();
    }

    @GetMapping("/certifications")
    public List<Certification> getCertifications() {
        return certificationRepository.findAll();
    }

    @GetMapping("/skills")
    public List<Skill> getSkills() {
        return skillRepository.findAll();
    }

    @GetMapping("/social-links")
    public List<SocialLink> getSocialLinks() {
        return socialLinkRepository.findAll();
    }

    /** Visitors submitting the "Contact Me" form - no auth required. */
    @PostMapping("/contact")
    public ResponseEntity<Void> submitContactMessage(@Valid @RequestBody ContactMessage message) {
        message.setId(null);
        message.setRead(false);
        contactMessageRepository.save(message);
        return ResponseEntity.ok().build();
    }
}
