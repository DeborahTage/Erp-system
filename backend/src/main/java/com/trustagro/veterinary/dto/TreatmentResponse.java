package com.trustagro.veterinary.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TreatmentResponse {
    private Long id;
    private Long diseaseCaseId;
    private Long farmId;
    private String farmName;
    private Long flockId;
    private String batchCode;
    private Long inventoryItemId;
    private Double quantity;
    private String drugName;
    private String dosage;
    private String route;
    private String duration;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long vetId;
    private String vetOfficer;
    private String outcome;
    private LocalDateTime createdAt;

    public void setId(Long id) { this.id = id; }
    public void setDiseaseCaseId(Long diseaseCaseId) { this.diseaseCaseId = diseaseCaseId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }
    public void setFarmName(String farmName) { this.farmName = farmName; }
    public void setFlockId(Long flockId) { this.flockId = flockId; }
    public void setBatchCode(String batchCode) { this.batchCode = batchCode; }
    public void setInventoryItemId(Long inventoryItemId) { this.inventoryItemId = inventoryItemId; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }
    public void setDrugName(String drugName) { this.drugName = drugName; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public void setRoute(String route) { this.route = route; }
    public void setDuration(String duration) { this.duration = duration; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setVetId(Long vetId) { this.vetId = vetId; }
    public void setVetOfficer(String vetOfficer) { this.vetOfficer = vetOfficer; }
    public void setOutcome(String outcome) { this.outcome = outcome; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @JsonProperty("vetId")
    public Long getVetId() {
        return vetId;
    }
}
