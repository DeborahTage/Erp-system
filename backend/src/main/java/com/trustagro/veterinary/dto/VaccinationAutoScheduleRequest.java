package com.trustagro.veterinary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VaccinationAutoScheduleRequest {
    @NotNull private Long farmId;
    @NotNull private Long flockId;
    @NotBlank @Size(max = 120) private String vaccineName;
    @Size(max = 120) private String vaccineType;
    @Size(max = 120) private String diseaseProtectedAgainst;
    @Size(max = 80) private String dosage;
    @Size(max = 80) private String route;
}
