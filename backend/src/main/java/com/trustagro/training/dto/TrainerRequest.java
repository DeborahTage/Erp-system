package com.trustagro.training.dto;

import com.trustagro.training.entity.TrainerStatus;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TrainerRequest {
    @Size(max = 120)
    private String fullName;

    @Size(max = 120)
    private String email;

    @Pattern(regexp = "^(\\+?[0-9 .()-]{7,20})?$", message = "Phone number format is invalid")
    private String phone;

    @Size(max = 120)
    private String specialization;

    @Size(max = 160)
    private String organization;

    private TrainerStatus status;

    @Size(max = 1000)
    private String notes;
}
