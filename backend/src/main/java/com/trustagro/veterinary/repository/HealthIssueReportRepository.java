package com.trustagro.veterinary.repository;

import com.trustagro.veterinary.entity.HealthIssueReport;
import com.trustagro.veterinary.entity.HealthIssueReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthIssueReportRepository extends JpaRepository<HealthIssueReport, Long> {
    List<HealthIssueReport> findAllByOrderByReportDateDescCreatedAtDesc();
    long countByStatus(HealthIssueReportStatus status);
}
