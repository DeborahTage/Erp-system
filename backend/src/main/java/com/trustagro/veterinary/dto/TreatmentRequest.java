package com.trustagro.veterinary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TreatmentRequest {
    private Long diseaseCaseId;
    @NotNull private Long farmId;
    @NotNull private Long flockId;
    @NotBlank @Size(max = 120) private String drugName;
    @Size(max = 120)
    private String dosage;
    @Size(max = 80)
    private String route;
    @Size(max = 80)
    private String duration;
    private LocalDate startDate;
    private LocalDate endDate;
    @Size(max = 200)
    private String outcome;
}
