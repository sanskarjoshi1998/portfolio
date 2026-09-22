package com.portfolio.app.controller;

import com.portfolio.app.entity.ContactMessage;
import com.portfolio.app.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/contact-messages")
@RequiredArgsConstructor
public class AdminContactMessageController {

    private final ContactMessageRepository contactMessageRepository;

    @GetMapping
    public List<ContactMessage> getAll() {
        return contactMessageRepository.findAll();
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ContactMessage> markAsRead(@PathVariable Long id) {
        return contactMessageRepository.findById(id)
                .map(msg -> {
                    msg.setRead(true);
                    return ResponseEntity.ok(contactMessageRepository.save(msg));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!contactMessageRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        contactMessageRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
