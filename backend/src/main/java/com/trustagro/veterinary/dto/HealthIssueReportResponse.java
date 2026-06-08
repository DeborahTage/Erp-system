package com.trustagro.veterinary.dto;

import com.trustagro.veterinary.entity.DiseaseSeverity;
import com.trustagro.veterinary.entity.HealthIssueReportStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class HealthIssueReportResponse {
    private Long id;
    private Long farmId;
    private String farmName;
    private Long flockId;
    private String batchCode;
    private Long dailyFarmRecordId;
    private String symptoms;
    private Integer mortalityObserved;
    private Integer numberAffected;
    private String remarks;
    private String reportedBy;
    private LocalDate reportDate;
    private HealthIssueReportStatus status;
    private String suspectedDiagnosis;
    private DiseaseSeverity severity;
    private String treatmentPlan;
    private String reviewedBy;
    private LocalDate reviewDate;
    private Long diseaseCaseId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
