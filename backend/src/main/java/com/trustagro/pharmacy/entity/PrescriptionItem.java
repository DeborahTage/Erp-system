package com.trustagro.pharmacy.entity;

import com.trustagro.inventory.entity.InventoryItem;
import com.trustagro.inventory.entity.StockBatch;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescription_items")
@Data
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private PharmacyPrescription prescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id")
    private StockBatch batch;

    private String dosage;
    private String frequency;
    private Integer durationDays;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal quantityPrescribed;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal quantityDispensed;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal unitPrice;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal lineTotal;
    
    @Column(columnDefinition = "TEXT")
    private String labelText;

    private LocalDateTime dispensedAt;
    
    private Boolean isActive = true;

    public PharmacyPrescription getPrescription() { return prescription; }
    public InventoryItem getInventoryItem() { return inventoryItem; }
    public String getDosage() { return dosage; }
    public Integer getDurationDays() { return durationDays; }
    public BigDecimal getQuantityPrescribed() { return quantityPrescribed; }

    public void setPrescription(PharmacyPrescription prescription) { this.prescription = prescription; }
    public void setInventoryItem(InventoryItem inventoryItem) { this.inventoryItem = inventoryItem; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }
    public void setQuantityPrescribed(BigDecimal quantityPrescribed) { this.quantityPrescribed = quantityPrescribed; }
}
