package com.trustagro.veterinary.entity;

import com.trustagro.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String prescriptionNumber;

    @Enumerated(EnumType.STRING)
    private PrescriptionType prescriptionType = PrescriptionType.INTERNAL_FARM;

    private Long farmId;
    private Long flockId;
    private Long clientId;
    private Long diseaseCaseId;
    private Long treatmentId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id")
    private com.trustagro.inventory.entity.InventoryItem inventoryItem;

    private String drugName; // Fallback if not specifically linked to inventory item
    private Double quantity;
    private String dosageInstruction;
    private String frequency;
    private Integer durationDays;
    private Integer withdrawalPeriodDays;
    private LocalDate withdrawalEndDate;
    private LocalDate prescribedDate;

    @Enumerated(EnumType.STRING)
    private PrescriptionPriority priority = PrescriptionPriority.NORMAL;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_vet")
    private User createdByVet;

    @Enumerated(EnumType.STRING)
    private PrescriptionStatus status = PrescriptionStatus.DRAFT;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void setPrescriptionType(PrescriptionType prescriptionType) { this.prescriptionType = prescriptionType; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }
    public void setFlockId(Long flockId) { this.flockId = flockId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public void setDiseaseCaseId(Long diseaseCaseId) { this.diseaseCaseId = diseaseCaseId; }
    public void setInventoryItem(com.trustagro.inventory.entity.InventoryItem inventoryItem) { this.inventoryItem = inventoryItem; }
    public void setDrugName(String drugName) { this.drugName = drugName; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }
    public void setDosageInstruction(String dosageInstruction) { this.dosageInstruction = dosageInstruction; }
    public void setWithdrawalPeriodDays(Integer withdrawalPeriodDays) { this.withdrawalPeriodDays = withdrawalPeriodDays; }
    public void setWithdrawalEndDate(LocalDate withdrawalEndDate) { this.withdrawalEndDate = withdrawalEndDate; }
    public void setCreatedByVet(User createdByVet) { this.createdByVet = createdByVet; }
    public void setStatus(PrescriptionStatus status) { this.status = status; }
    public void setPrescriptionNumber(String prescriptionNumber) { this.prescriptionNumber = prescriptionNumber; }
    public void setPriority(PrescriptionPriority priority) { this.priority = priority; }
    public void setNotes(String notes) { this.notes = notes; }

    public Long getId() { return id; }
    public String getPrescriptionNumber() { return prescriptionNumber; }
    public PrescriptionType getPrescriptionType() { return prescriptionType; }
    public Long getFarmId() { return farmId; }
    public Long getFlockId() { return flockId; }
    public Long getClientId() { return clientId; }
    public Long getDiseaseCaseId() { return diseaseCaseId; }
    public com.trustagro.inventory.entity.InventoryItem getInventoryItem() { return inventoryItem; }
    public String getDrugName() { return drugName; }
    public Double getQuantity() { return quantity; }
    public String getDosageInstruction() { return dosageInstruction; }
    public Integer getWithdrawalPeriodDays() { return withdrawalPeriodDays; }
    public User getCreatedByVet() { return createdByVet; }
    public PrescriptionStatus getStatus() { return status; }
    public LocalDate getWithdrawalEndDate() { return withdrawalEndDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public String getFrequency() { return frequency; }
    public Integer getDurationDays() { return durationDays; }
    public PrescriptionPriority getPriority() { return priority; }
    public String getNotes() { return notes; }
}
