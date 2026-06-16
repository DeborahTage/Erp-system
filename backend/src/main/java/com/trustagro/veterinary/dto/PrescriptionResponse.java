package com.trustagro.veterinary.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.trustagro.veterinary.entity.PrescriptionStatus;
import com.trustagro.veterinary.entity.PrescriptionType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PrescriptionResponse {
    private Long id;
    private String prescriptionNumber;
    private PrescriptionType prescriptionType;
    private Long farmId;
    private String farmName;
    private Long flockId;
    private String batchCode;
    private Long clientId;
    private Long diseaseCaseId;
    private Long inventoryItemId;
    private String drugName;
    private Double quantity;
    private String dosageInstruction;
    private Long prescribedById;
    private String createdByVet;
    private PrescriptionStatus status;
    private LocalDateTime createdAt;
    private Integer withdrawalPeriodDays;
    private java.time.LocalDate withdrawalEndDate;

    public void setId(Long id) { this.id = id; }
    public void setPrescriptionNumber(String prescriptionNumber) { this.prescriptionNumber = prescriptionNumber; }
    public void setPrescriptionType(PrescriptionType prescriptionType) { this.prescriptionType = prescriptionType; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }
    public void setFarmName(String farmName) { this.farmName = farmName; }
    public void setFlockId(Long flockId) { this.flockId = flockId; }
    public void setBatchCode(String batchCode) { this.batchCode = batchCode; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public void setDiseaseCaseId(Long diseaseCaseId) { this.diseaseCaseId = diseaseCaseId; }
    public void setInventoryItemId(Long inventoryItemId) { this.inventoryItemId = inventoryItemId; }
    public void setDrugName(String drugName) { this.drugName = drugName; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }
    public void setDosageInstruction(String dosageInstruction) { this.dosageInstruction = dosageInstruction; }
    public void setPrescribedById(Long prescribedById) { this.prescribedById = prescribedById; }
    public void setCreatedByVet(String createdByVet) { this.createdByVet = createdByVet; }
    public void setStatus(PrescriptionStatus status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setWithdrawalPeriodDays(Integer withdrawalPeriodDays) { this.withdrawalPeriodDays = withdrawalPeriodDays; }
    public void setWithdrawalEndDate(java.time.LocalDate withdrawalEndDate) { this.withdrawalEndDate = withdrawalEndDate; }

    @JsonProperty("prescribedBy")
    public String getPrescribedBy() {
        return createdByVet;
    }
}
