package com.trustagro.training.dto;

import com.trustagro.training.entity.TrainingParticipantStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TrainingParticipantRequest {
    @Size(max = 120)
    private String fullName;

    @Size(max = 120)
    private String email;

    @Pattern(regexp = "^(\\+?[0-9 .()-]{7,20})?$", message = "Phone number format is invalid")
    private String phone;

    @Size(max = 160)
    private String organization;

    @Size(max = 120)
    private String participantRole;

    @Size(max = 180)
    private String location;

    @NotNull
    private Long sessionId;

    private TrainingParticipantStatus status;

    @Size(max = 1000)
    private String notes;
}
