package com.trustagro.audit.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trustagro.audit.entity.AuditLog;
import com.trustagro.audit.repository.AuditLogRepository;
import com.trustagro.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    /**
     * Log a simple string-based audit entry.
     */
    public void log(String action, String module, Long recordId, String oldValue, String newValue) {
        log(action, module, null, recordId, oldValue, newValue);
    }

    /**
     * Public entry point for logging. Captures current user context.
     */
    public void log(String action, String module, String entityType, Long entityId, String oldValue, String newValue) {
        String email = "System";
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                email = auth.getName();
            }
        } catch (Exception ignored) {}
        
        saveAuditAsync(action, module, entityType, entityId, oldValue, newValue, email);
    }

    @Async
    protected void saveAuditAsync(String action, String module, String entityType, Long entityId, 
                                String oldValue, String newValue, String email) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAction(action);
        auditLog.setModule(module);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setOldValue(oldValue);
        auditLog.setNewValue(newValue);
        auditLog.setUserEmail(email);
        
        try {
            userRepository.findByEmail(email).ifPresent(u -> auditLog.setUserId(u.getId()));
        } catch (Exception e) {
            log.warn("Failed to find user for audit log: {}", email);
        }
        
        auditLogRepository.save(auditLog);
    }

    /**
     * Convenience method for logging object state as JSON.
     */
    @Async
    public void logObject(String action, String module, String entityType, Long entityId,
                          Object oldObj, Object newObj) {
        try {
            String oldVal = oldObj != null ? objectMapper.writeValueAsString(oldObj) : null;
            String newVal = newObj != null ? objectMapper.writeValueAsString(newObj) : null;
            log(action, module, entityType, entityId, oldVal, newVal);
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize audit log objects for {}/{}", entityType, entityId);
            log(action, module, entityType, entityId, null, null);
        }
    }

    public List<AuditLog> getAll() {
        return auditLogRepository.findAll();
    }

    public List<AuditLog> getByModule(String module) {
        return auditLogRepository.findByModuleOrderByCreatedAtDesc(module);
    }

    public List<AuditLog> getWithFilters(String module, String entityType, String action,
                                          Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findWithFilters(module, entityType, action, userId, startDate, endDate);
    }
}
