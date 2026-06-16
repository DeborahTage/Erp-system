package com.trustagro.veterinary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import com.trustagro.veterinary.entity.PrescriptionType;

@Data
public class PrescriptionRequest {
    @NotBlank @Size(max = 60) private String prescriptionNumber;
    private PrescriptionType prescriptionType;
    private Long farmId;
    private Long flockId;
    private Long clientId;
    private Long diseaseCaseId;
    private Long inventoryItemId;
    @NotBlank @Size(max = 120) private String drugName;
    @NotNull @Positive private Double quantity;
    @Size(max = 1200)
    private String dosageInstruction;
    private Integer withdrawalPeriodDays;

    public String getPrescriptionNumber() { return prescriptionNumber; }
    public PrescriptionType getPrescriptionType() { return prescriptionType; }
    public Long getFarmId() { return farmId; }
    public Long getFlockId() { return flockId; }
    public Long getClientId() { return clientId; }
    public Long getDiseaseCaseId() { return diseaseCaseId; }
    public Long getInventoryItemId() { return inventoryItemId; }
    public String getDrugName() { return drugName; }
    public Double getQuantity() { return quantity; }
    public String getDosageInstruction() { return dosageInstruction; }
    public Integer getWithdrawalPeriodDays() { return withdrawalPeriodDays; }
}
