package com.trustagro.veterinary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TreatmentRequest {
    private Long diseaseCaseId;
    @NotNull private Long farmId;
    @NotNull private Long flockId;
    private Long inventoryItemId;
    @Positive
    private Double quantity;
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

    public Long getDiseaseCaseId() { return diseaseCaseId; }
    public Long getFarmId() { return farmId; }
    public Long getFlockId() { return flockId; }
    public Long getInventoryItemId() { return inventoryItemId; }
    public Double getQuantity() { return quantity; }
    public String getDrugName() { return drugName; }
    public String getDosage() { return dosage; }
    public String getRoute() { return route; }
    public String getDuration() { return duration; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public String getOutcome() { return outcome; }
}
