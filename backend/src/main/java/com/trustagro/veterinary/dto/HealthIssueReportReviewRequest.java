package com.trustagro.veterinary.dto;

import com.trustagro.veterinary.entity.DiseaseSeverity;
import com.trustagro.veterinary.entity.HealthIssueReportStatus;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HealthIssueReportReviewRequest {
    @Size(max = 120)
    private String suspectedDiagnosis;
    private DiseaseSeverity severity;
    @Size(max = 1200)
    private String treatmentPlan;
    private HealthIssueReportStatus status;
    private Long diseaseCaseId;

    public String getSuspectedDiagnosis() { return suspectedDiagnosis; }
    public DiseaseSeverity getSeverity() { return severity; }
    public String getTreatmentPlan() { return treatmentPlan; }
    public HealthIssueReportStatus getStatus() { return status; }
    public Long getDiseaseCaseId() { return diseaseCaseId; }
}
