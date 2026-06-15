package com.trustagro.inventory.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "item_locations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"inventory_item_id", "location_id"})
})
@Data
public class ItemLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    private Double currentStock = 0.0;
    private Double reservedStock = 0.0;
    
    private Double reorderPoint;
}
