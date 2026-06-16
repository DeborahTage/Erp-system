package com.trustagro.finance.entity;

import com.trustagro.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cash_reconciliations")
@Data
public class CashReconciliation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate reconciliationDate;

    @Column(nullable = false)
    private BigDecimal expectedCash;

    @Column(nullable = false)
    private BigDecimal actualCash;

    @Column(nullable = false)
    private BigDecimal variance;

    @Column(nullable = false)
    private String status; // BALANCED, SHORT, OVER

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "closed_by")
    private User closedBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public void setReconciliationDate(LocalDate reconciliationDate) { this.reconciliationDate = reconciliationDate; }
    public void setExpectedCash(BigDecimal expectedCash) { this.expectedCash = expectedCash; }
    public void setActualCash(BigDecimal actualCash) { this.actualCash = actualCash; }
    public void setVariance(BigDecimal variance) { this.variance = variance; }
    public void setStatus(String status) { this.status = status; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setClosedBy(User closedBy) { this.closedBy = closedBy; }

    public Long getId() { return id; }
    public LocalDate getReconciliationDate() { return reconciliationDate; }
    public BigDecimal getExpectedCash() { return expectedCash; }
    public BigDecimal getActualCash() { return actualCash; }
    public BigDecimal getVariance() { return variance; }
    public String getStatus() { return status; }
    public String getNotes() { return notes; }
    public User getClosedBy() { return closedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
