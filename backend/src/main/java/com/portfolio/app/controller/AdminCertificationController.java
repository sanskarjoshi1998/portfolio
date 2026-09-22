package com.portfolio.app.controller;

import com.portfolio.app.entity.Certification;
import com.portfolio.app.repository.CertificationRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/certifications")
@RequiredArgsConstructor
public class AdminCertificationController {

    private final CertificationRepository certificationRepository;

    @GetMapping
    public List<Certification> getAll() {
        return certificationRepository.findAll();
    }

    @PostMapping
    public Certification create(@Valid @RequestBody Certification certification) {
        certification.setId(null);
        return certificationRepository.save(certification);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Certification> update(@PathVariable Long id, @Valid @RequestBody Certification certification) {
        if (!certificationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        certification.setId(id);
        return ResponseEntity.ok(certificationRepository.save(certification));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!certificationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        certificationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
