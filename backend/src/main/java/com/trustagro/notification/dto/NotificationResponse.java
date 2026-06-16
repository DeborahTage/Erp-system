package com.trustagro.notification.dto;

import com.trustagro.notification.entity.NotificationType;
import com.trustagro.user.entity.Role;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private Role targetRole;
    private String relatedModule;
    private boolean isRead;
    private LocalDateTime createdAt;

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setMessage(String message) { this.message = message; }
    public void setType(NotificationType type) { this.type = type; }
    public void setTargetRole(Role targetRole) { this.targetRole = targetRole; }
    public void setRelatedModule(String relatedModule) { this.relatedModule = relatedModule; }
    public void setRead(boolean isRead) { this.isRead = isRead; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
