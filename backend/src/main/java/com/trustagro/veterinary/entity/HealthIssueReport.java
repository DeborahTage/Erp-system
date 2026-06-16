package com.trustagro.veterinary.entity;

import com.trustagro.farm.entity.DailyFarmRecord;
import com.trustagro.farm.entity.Farm;
import com.trustagro.farm.entity.Flock;
import com.trustagro.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_issue_reports")
@Data
public class HealthIssueReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flock_id", nullable = false)
    private Flock flock;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "daily_farm_record_id")
    private DailyFarmRecord dailyFarmRecord;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    private Integer mortalityObserved;
    private Integer numberAffected;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by")
    private User reportedBy;

    private LocalDate reportDate;

    @Enumerated(EnumType.STRING)
    private HealthIssueReportStatus status = HealthIssueReportStatus.OPEN;

    private String suspectedDiagnosis;

    @Enumerated(EnumType.STRING)
    private DiseaseSeverity severity;

    @Column(columnDefinition = "TEXT")
    private String treatmentPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    private LocalDate reviewDate;

    private Long diseaseCaseId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public Farm getFarm() { return farm; }
    public Flock getFlock() { return flock; }
    public DailyFarmRecord getDailyFarmRecord() { return dailyFarmRecord; }
    public String getSymptoms() { return symptoms; }
    public Integer getMortalityObserved() { return mortalityObserved; }
    public Integer getNumberAffected() { return numberAffected; }
    public String getRemarks() { return remarks; }
    public User getReportedBy() { return reportedBy; }
    public LocalDate getReportDate() { return reportDate; }
    public HealthIssueReportStatus getStatus() { return status; }
    public String getSuspectedDiagnosis() { return suspectedDiagnosis; }
    public DiseaseSeverity getSeverity() { return severity; }
    public String getTreatmentPlan() { return treatmentPlan; }
    public User getReviewedBy() { return reviewedBy; }
    public LocalDate getReviewDate() { return reviewDate; }
    public Long getDiseaseCaseId() { return diseaseCaseId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setFarm(Farm farm) { this.farm = farm; }
    public void setFlock(Flock flock) { this.flock = flock; }
    public void setDailyFarmRecord(DailyFarmRecord dailyFarmRecord) { this.dailyFarmRecord = dailyFarmRecord; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public void setMortalityObserved(Integer mortalityObserved) { this.mortalityObserved = mortalityObserved; }
    public void setNumberAffected(Integer numberAffected) { this.numberAffected = numberAffected; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public void setReportedBy(User reportedBy) { this.reportedBy = reportedBy; }
    public void setReportDate(LocalDate reportDate) { this.reportDate = reportDate; }
    public void setStatus(HealthIssueReportStatus status) { this.status = status; }
    public void setSuspectedDiagnosis(String suspectedDiagnosis) { this.suspectedDiagnosis = suspectedDiagnosis; }
    public void setSeverity(DiseaseSeverity severity) { this.severity = severity; }
    public void setTreatmentPlan(String treatmentPlan) { this.treatmentPlan = treatmentPlan; }
    public void setReviewedBy(User reviewedBy) { this.reviewedBy = reviewedBy; }
    public void setReviewDate(LocalDate reviewDate) { this.reviewDate = reviewDate; }
    public void setDiseaseCaseId(Long diseaseCaseId) { this.diseaseCaseId = diseaseCaseId; }
}
