package com.trustagro.veterinary.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BiosecurityLogResponse {
    private Long id;
    private Long farmId;
    private String farmName;
    private Long flockId;
    private String batchCode;
    private String barnId;
    private boolean footbathCompleted;
    private boolean vehicleSprayCompleted;
    private boolean visitorLogCompleted;
    private boolean ppeCheckCompleted;
    private String notes;
    private String staffSignature;
    private String loggedBy;
    private LocalDateTime visitTimestamp;
    private LocalDateTime createdAt;
}
