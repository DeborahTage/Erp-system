package com.trustagro.veterinary.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BiosecurityLogRequest {
    @NotNull private Long farmId;
    private Long flockId;
    @Size(max = 60) private String barnId;
    private boolean footbathCompleted;
    private boolean vehicleSprayCompleted;
    private boolean visitorLogCompleted;
    private boolean ppeCheckCompleted;
    @Size(max = 2000) private String notes;
    @Size(max = 120) private String staffSignature;
    private LocalDateTime visitTimestamp;
}
