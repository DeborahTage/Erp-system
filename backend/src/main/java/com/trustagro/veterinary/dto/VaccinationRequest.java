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
    @Size(max = 80)
    private String dosage;
    @Size(max = 80)
    private String route;
    @Size(max = 120)
    private String responsiblePerson;
    @Size(max = 1000)
    private String remarks;

    public Long getFarmId() { return farmId; }
    public Long getFlockId() { return flockId; }
    public String getVaccineName() { return vaccineName; }
    public String getDiseaseProtectedAgainst() { return diseaseProtectedAgainst; }
    public LocalDate getScheduledDate() { return scheduledDate; }
    public String getDosage() { return dosage; }
    public String getRoute() { return route; }
    public String getResponsiblePerson() { return responsiblePerson; }
    public String getRemarks() { return remarks; }
}
