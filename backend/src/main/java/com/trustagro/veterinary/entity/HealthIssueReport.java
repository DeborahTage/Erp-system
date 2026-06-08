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
}
