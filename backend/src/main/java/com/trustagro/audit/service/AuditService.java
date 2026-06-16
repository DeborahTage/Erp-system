package com.trustagro.audit.service;

import com.trustagro.audit.entity.AuditLog;
import com.trustagro.audit.repository.AuditLogRepository;
import com.trustagro.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public void log(String action, String module, Long recordId, String oldValue, String newValue) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setModule(module);
        log.setRecordId(recordId);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            log.setUserEmail(email);
            userRepository.findByEmail(email).ifPresent(u -> log.setUserId(u.getId()));
        } catch (Exception ignored) {
        }
        auditLogRepository.save(log);
    }

    public void log(String action, String module, String subModule, Long recordId, String oldValue, String newValue) {
        log(action, module + ":" + subModule, recordId, oldValue, newValue);
    }

    public void logObject(String action, String module, String subModule, Long recordId, Object oldValue,
            Object newValue) {
        try {
            String oldValueJson = oldValue != null ? objectMapper.writeValueAsString(oldValue) : null;
            String newValueJson = newValue != null ? objectMapper.writeValueAsString(newValue) : null;
            log(action, module + ":" + subModule, recordId, oldValueJson, newValueJson);
        } catch (Exception e) {
            // Fall back to simple logging if serialization fails
            log(action, module + ":" + subModule, recordId, "[object]", "[object]");
        }
    }

    public List<AuditLog> getAll() {
        return auditLogRepository.findAll();
    }

    public List<AuditLog> getByModule(String module) {
        return auditLogRepository.findByModuleOrderByCreatedAtDesc(module);
    }
}
