package com.trustagro.audit.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_user", columnList = "userId"),
    @Index(name = "idx_audit_entity", columnList = "entityType"),
    @Index(name = "idx_audit_action", columnList = "action"),
    @Index(name = "idx_audit_created", columnList = "createdAt")
})
@Data
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String userEmail;

    /** CREATE, UPDATE, DELETE, VIEW */
    @Column(nullable = false)
    private String action;

    /** High-level module name, e.g. INVENTORY, VETERINARY */
    @Column(nullable = false)
    private String module;

    /** Fine-grained entity type, e.g. VACCINATION, DISEASE_CASE, FLOCK */
    private String entityType;

    /** Primary key of the affected record */
    private Long entityId;

    @Column(columnDefinition = "TEXT")
    private String oldValue;

    @Column(columnDefinition = "TEXT")
    private String newValue;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public void setUserId(Long userId) { this.userId = userId; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public void setAction(String action) { this.action = action; }
    public void setModule(String module) { this.module = module; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
    public void setOldValue(String oldValue) { this.oldValue = oldValue; }
    public void setNewValue(String newValue) { this.newValue = newValue; }
}
