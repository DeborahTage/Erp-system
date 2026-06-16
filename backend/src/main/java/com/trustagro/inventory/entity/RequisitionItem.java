package com.trustagro.inventory.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "requisition_items")
@Data
public class RequisitionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requisition_id", nullable = false)
    private InternalRequisition requisition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem item;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_location_id")
    private Location fromLocation;

    private Double quantityRequested = 0.0;
    private Double quantityApproved = 0.0;
    private Double quantityIssued = 0.0;
    
    private BigDecimal unitCost;
    private BigDecimal totalCost;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public InternalRequisition getRequisition() { return requisition; }
    public void setRequisition(InternalRequisition requisition) { this.requisition = requisition; }
    public InventoryItem getItem() { return item; }
    public void setItem(InventoryItem item) { this.item = item; }
    public Location getFromLocation() { return fromLocation; }
    public void setFromLocation(Location fromLocation) { this.fromLocation = fromLocation; }
    public Double getQuantityRequested() { return quantityRequested; }
    public void setQuantityRequested(Double quantityRequested) { this.quantityRequested = quantityRequested; }
    public Double getQuantityApproved() { return quantityApproved; }
    public void setQuantityApproved(Double quantityApproved) { this.quantityApproved = quantityApproved; }
    public Double getQuantityIssued() { return quantityIssued; }
    public void setQuantityIssued(Double quantityIssued) { this.quantityIssued = quantityIssued; }
    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }
    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }
}
