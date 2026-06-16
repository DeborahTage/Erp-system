package com.trustagro.veterinary.entity;

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
@Table(name = "disease_cases")
@Data
public class DiseaseCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id")
    private Farm farm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flock_id")
    private Flock flock;

    private LocalDate dateDetected;
    private LocalDate dateResolved;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    private String suspectedDisease;
    private String diseaseType;
    private String diagnosis;
    private String barnId;
    private Integer numberAffected;
    private Integer numberDead;

    @Enumerated(EnumType.STRING)
    private DiseaseSeverity severity;

    @Enumerated(EnumType.STRING)
    private DiseaseStatus status = DiseaseStatus.ACTIVE;

    @Column(columnDefinition = "TEXT")
    private String actionTaken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by")
    private User reportedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_assigned")
    private User vetAssigned;

    private String attachmentPath;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public Farm getFarm() { return farm; }
    public Flock getFlock() { return flock; }
    public LocalDate getDateDetected() { return dateDetected; }
    public LocalDate getDateResolved() { return dateResolved; }
    public String getSymptoms() { return symptoms; }
    public String getSuspectedDisease() { return suspectedDisease; }
    public Integer getNumberAffected() { return numberAffected; }
    public Integer getNumberDead() { return numberDead; }
    public DiseaseSeverity getSeverity() { return severity; }
    public DiseaseStatus getStatus() { return status; }
    public String getActionTaken() { return actionTaken; }
    public String getAttachmentPath() { return attachmentPath; }
    public User getReportedBy() { return reportedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setFarm(Farm farm) { this.farm = farm; }
    public void setFlock(Flock flock) { this.flock = flock; }
    public void setDateDetected(LocalDate dateDetected) { this.dateDetected = dateDetected; }
    public void setDateResolved(LocalDate dateResolved) { this.dateResolved = dateResolved; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public void setSuspectedDisease(String suspectedDisease) { this.suspectedDisease = suspectedDisease; }
    public void setNumberAffected(Integer numberAffected) { this.numberAffected = numberAffected; }
    public void setNumberDead(Integer numberDead) { this.numberDead = numberDead; }
    public void setSeverity(DiseaseSeverity severity) { this.severity = severity; }
    public void setStatus(DiseaseStatus status) { this.status = status; }
    public void setActionTaken(String actionTaken) { this.actionTaken = actionTaken; }
    public void setAttachmentPath(String attachmentPath) { this.attachmentPath = attachmentPath; }
    public void setReportedBy(User reportedBy) { this.reportedBy = reportedBy; }
}
