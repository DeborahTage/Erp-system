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

    public void setId(Long id) { this.id = id; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }
    public void setFarmName(String farmName) { this.farmName = farmName; }
    public void setFlockId(Long flockId) { this.flockId = flockId; }
    public void setBatchCode(String batchCode) { this.batchCode = batchCode; }
    public void setDailyFarmRecordId(Long dailyFarmRecordId) { this.dailyFarmRecordId = dailyFarmRecordId; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public void setMortalityObserved(Integer mortalityObserved) { this.mortalityObserved = mortalityObserved; }
    public void setNumberAffected(Integer numberAffected) { this.numberAffected = numberAffected; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public void setReportedBy(String reportedBy) { this.reportedBy = reportedBy; }
    public void setReportDate(LocalDate reportDate) { this.reportDate = reportDate; }
    public void setStatus(HealthIssueReportStatus status) { this.status = status; }
    public void setSuspectedDiagnosis(String suspectedDiagnosis) { this.suspectedDiagnosis = suspectedDiagnosis; }
    public void setSeverity(DiseaseSeverity severity) { this.severity = severity; }
    public void setTreatmentPlan(String treatmentPlan) { this.treatmentPlan = treatmentPlan; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
    public void setReviewDate(LocalDate reviewDate) { this.reviewDate = reviewDate; }
    public void setDiseaseCaseId(Long diseaseCaseId) { this.diseaseCaseId = diseaseCaseId; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
