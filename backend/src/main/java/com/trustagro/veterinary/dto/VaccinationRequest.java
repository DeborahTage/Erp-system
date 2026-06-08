package com.trustagro.veterinary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class VaccinationRequest {
    @NotNull private Long farmId;
    @NotNull private Long flockId;
    @NotBlank @Size(max = 120) private String vaccineName;
    @Size(max = 120)
    private String diseaseProtectedAgainst;
    @NotNull private LocalDate scheduledDate;
    @Size(max = 1000)
    private String remarks;
}
