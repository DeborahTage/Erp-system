package com.trustagro.training.dto;

import com.trustagro.training.entity.TrainerStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TrainerResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String specialization;
    private String organization;
    private TrainerStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
