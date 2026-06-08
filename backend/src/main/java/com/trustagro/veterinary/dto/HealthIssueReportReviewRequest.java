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
}
