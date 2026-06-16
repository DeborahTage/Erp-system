package com.trustagro.veterinary.repository;

import com.trustagro.veterinary.entity.VeterinaryAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VeterinaryAttachmentRepository extends JpaRepository<VeterinaryAttachment, Long> {
    List<VeterinaryAttachment> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, Long entityId);
}
