package com.trustagro.inventory.dto;

import com.trustagro.inventory.entity.ItemCategory;
import com.trustagro.inventory.entity.ItemStatus;
import com.trustagro.inventory.entity.ItemUnit;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InventoryItemResponse {
    private Long id;
    private String itemName;
    private ItemCategory category;
    private ItemUnit unit;
    private String sku;
    private Double minimumStockLevel;
    private Double reorderPoint;
    private Double reorderQty;
    private String storageLocation;
    private boolean expiryRequired;
    private ItemStatus status;
    private Double currentStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Added for frontend compatibility
    private String name;
    private String unitString;

    public Long getId() { return id; }
    public String getItemName() { return itemName; }
    public String getSku() { return sku; }
    public ItemCategory getCategory() { return category; }
    public Double getCurrentStock() { return currentStock; }

    public void setId(Long id) { this.id = id; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public void setSku(String sku) { this.sku = sku; }
    public void setCategory(ItemCategory category) { this.category = category; }
    public void setCurrentStock(Double currentStock) { this.currentStock = currentStock; }
    public ItemUnit getUnit() { return unit; }
    public void setUnit(ItemUnit unit) { this.unit = unit; }
    
    // Explicit for frontend compatibility if mapped from String
    public void setName(String name) { this.name = name; this.itemName = name; }
    public String getName() { return this.name != null ? this.name : this.itemName; }
    public void setUnit(String unitString) { this.unitString = unitString; }
    public String getUnitString() { return this.unitString; }
    
    public Double getReorderPoint() { return reorderPoint; }
    public void setReorderPoint(Double reorderPoint) { this.reorderPoint = reorderPoint; }
}
