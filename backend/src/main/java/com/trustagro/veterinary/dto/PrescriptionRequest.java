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
}
