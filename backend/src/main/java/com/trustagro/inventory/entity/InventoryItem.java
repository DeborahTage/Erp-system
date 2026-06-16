package com.trustagro.inventory.entity;

import com.trustagro.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "inventory_items")
@Data
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String sku;

    @Column(unique = true)
    private String barcode;

    @Column(name = "rfid_tag", unique = true)
    private String rfidTag;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    private String description;

    @Enumerated(EnumType.STRING)
    private ItemCategory category;

    private String subcategory;

    @Enumerated(EnumType.STRING)
    private AllocationType allocationType = AllocationType.HYBRID;

    @Enumerated(EnumType.STRING)
    private ItemUnit unit;

    private BigDecimal unitWeightKg;
    private Double reorderPoint = 0.0;
    private Double reorderQty = 0.0;
    private Double safetyStock = 0.0;
    private Integer leadTimeDays = 7;

    private Double currentStock = 0.0;
    private Double reservedStock = 0.0;

    @Transient
    public Double getAvailableStock() {
        return (currentStock != null ? currentStock : 0.0) - (reservedStock != null ? reservedStock : 0.0);
    }

    private BigDecimal avgUnitCost;
    private BigDecimal lastPurchasePrice;
    private BigDecimal sellingPrice; // legacy, kept for compatibility
    
    // Commercial Pricing
    @Column(precision = 12, scale = 2)
    private BigDecimal retailPrice;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal wholesalePrice;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal partnerPrice;

    private Boolean isControlled = false;

    private String storageLocation;
    private String storageZone;
    private String shelfLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preferred_supplier_id")
    private Supplier preferredSupplier;

    @Enumerated(EnumType.STRING)
    private ItemStatus status = ItemStatus.ACTIVE;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Explicit accessors
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public Double getCurrentStock() { return currentStock; }
    public void setCurrentStock(Double currentStock) { this.currentStock = currentStock; }
    public Double getReorderPoint() { return reorderPoint; }
    public void setReorderPoint(Double reorderPoint) { this.reorderPoint = reorderPoint; }
    public ItemUnit getUnit() { return unit; }
    public void setUnit(ItemUnit unit) { this.unit = unit; }
    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }
    public ItemCategory getCategory() { return category; }
    public void setCategory(ItemCategory category) { this.category = category; }
    public Supplier getSupplier() { return supplier; }
    public Supplier getPreferredSupplier() { return preferredSupplier; }
    public Double getReorderQty() { return reorderQty; }
    public BigDecimal getLastPurchasePrice() { return lastPurchasePrice; }
    public BigDecimal getAvgUnitCost() { return avgUnitCost; }
    public void setAvgUnitCost(BigDecimal avgUnitCost) { this.avgUnitCost = avgUnitCost; }
    public void setLastPurchasePrice(BigDecimal lastPurchasePrice) { this.lastPurchasePrice = lastPurchasePrice; }
    public Double getMinimumStockLevel() { return reorderPoint; }
    public ItemStatus getStatus() { return status; }
    public void setStatus(ItemStatus status) { this.status = status; }
    public AllocationType getAllocationType() { return allocationType; }
    public void setAllocationType(AllocationType allocationType) { this.allocationType = allocationType; }
    
    public BigDecimal getRetailPrice() { return retailPrice != null ? retailPrice : sellingPrice; }
    public void setRetailPrice(BigDecimal retailPrice) { this.retailPrice = retailPrice; }
    public BigDecimal getWholesalePrice() { return wholesalePrice; }
    public void setWholesalePrice(BigDecimal wholesalePrice) { this.wholesalePrice = wholesalePrice; }
    public BigDecimal getPartnerPrice() { return partnerPrice; }
    public void setPartnerPrice(BigDecimal partnerPrice) { this.partnerPrice = partnerPrice; }
    public BigDecimal getSellingPrice() { return sellingPrice; }
    public void setSellingPrice(BigDecimal sellingPrice) { this.sellingPrice = sellingPrice; }
    public Boolean getIsControlled() { return isControlled != null ? isControlled : false; }
    public void setIsControlled(Boolean isControlled) { this.isControlled = isControlled; }
}
