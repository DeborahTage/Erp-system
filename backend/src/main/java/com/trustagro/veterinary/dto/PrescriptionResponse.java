package com.trustagro.veterinary.dto;

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
    private String createdByVet;
    private PrescriptionStatus status;
    private LocalDateTime createdAt;
}
