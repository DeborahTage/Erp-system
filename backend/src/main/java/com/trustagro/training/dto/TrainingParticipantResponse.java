package com.trustagro.training.dto;

import com.trustagro.training.entity.TrainingParticipantStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TrainingParticipantResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String organization;
    private String participantRole;
    private String location;
    private Long sessionId;
    private String sessionTitle;
    private TrainingParticipantStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
