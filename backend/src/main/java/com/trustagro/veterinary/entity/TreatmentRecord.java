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
@Table(name = "treatment_records")
@Data
public class TreatmentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disease_case_id")
    private DiseaseCase diseaseCase;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id")
    private Farm farm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flock_id")
    private Flock flock;

    private String treatmentType;
    private String drugName;

    @Enumerated(EnumType.STRING)
    private TreatmentStatus status = TreatmentStatus.ACTIVE;
    private Long inventoryItemId;
    private Double quantity;
    private String dosage;
    private String route;
    private String duration;
    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_officer")
    private User vetOfficer;

    private String outcome;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void setDiseaseCase(DiseaseCase diseaseCase) { this.diseaseCase = diseaseCase; }
    public void setFarm(Farm farm) { this.farm = farm; }
    public void setFlock(Flock flock) { this.flock = flock; }
    public void setInventoryItemId(Long inventoryItemId) { this.inventoryItemId = inventoryItemId; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }
    public void setDrugName(String drugName) { this.drugName = drugName; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public void setRoute(String route) { this.route = route; }
    public void setDuration(String duration) { this.duration = duration; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setOutcome(String outcome) { this.outcome = outcome; }
    public void setVetOfficer(User vetOfficer) { this.vetOfficer = vetOfficer; }

    public Long getId() { return id; }
    public DiseaseCase getDiseaseCase() { return diseaseCase; }
    public Farm getFarm() { return farm; }
    public Flock getFlock() { return flock; }
    public String getTreatmentType() { return treatmentType; }
    public String getDrugName() { return drugName; }
    public TreatmentStatus getStatus() { return status; }
    public Long getInventoryItemId() { return inventoryItemId; }
    public Double getQuantity() { return quantity; }
    public String getDosage() { return dosage; }
    public String getRoute() { return route; }
    public String getDuration() { return duration; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public User getVetOfficer() { return vetOfficer; }
    public String getOutcome() { return outcome; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
