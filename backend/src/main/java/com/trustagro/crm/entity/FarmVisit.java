package com.trustagro.crm.entity;

import com.trustagro.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "farm_visits")
@Data
public class FarmVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private CrmClient client;

    private LocalDate visitDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "visited_by")
    private User visitedBy;

    private String purpose;

    @Column(columnDefinition = "TEXT")
    private String observation;

    @Column(columnDefinition = "TEXT")
    private String adviceGiven;

    private LocalDate nextFollowUpDate;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public CrmClient getClient() { return client; }
    public LocalDate getVisitDate() { return visitDate; }
    public User getVisitedBy() { return visitedBy; }
    public String getPurpose() { return purpose; }
    public String getObservation() { return observation; }
    public String getAdviceGiven() { return adviceGiven; }
    public LocalDate getNextFollowUpDate() { return nextFollowUpDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setClient(CrmClient client) { this.client = client; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }
    public void setVisitedBy(User visitedBy) { this.visitedBy = visitedBy; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public void setObservation(String observation) { this.observation = observation; }
    public void setAdviceGiven(String adviceGiven) { this.adviceGiven = adviceGiven; }
    public void setNextFollowUpDate(LocalDate nextFollowUpDate) { this.nextFollowUpDate = nextFollowUpDate; }
}
