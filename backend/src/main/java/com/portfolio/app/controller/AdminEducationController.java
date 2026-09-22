package com.portfolio.app.controller;

import com.portfolio.app.entity.Education;
import com.portfolio.app.repository.EducationRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/education")
@RequiredArgsConstructor
public class AdminEducationController {

    private final EducationRepository educationRepository;

    @GetMapping
    public List<Education> getAll() {
        return educationRepository.findAll();
    }

    @PostMapping
    public Education create(@Valid @RequestBody Education education) {
        education.setId(null);
        return educationRepository.save(education);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Education> update(@PathVariable Long id, @Valid @RequestBody Education education) {
        if (!educationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        education.setId(id);
        return ResponseEntity.ok(educationRepository.save(education));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!educationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        educationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
