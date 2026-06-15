package com.trustagro.inventory.entity;

import com.trustagro.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "inventory_counts")
@Data
public class InventoryCount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id")
    private StockBatch batch;

    @Column(nullable = false)
    private Double expectedQty;

    @Column(nullable = false)
    private Double countedQty;

    @Transient
    public Double getVariance() {
        return (countedQty != null ? countedQty : 0.0) - (expectedQty != null ? expectedQty : 0.0);
    }

    @Column(nullable = false)
    private LocalDate countDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counted_by")
    private User countedBy;

    private String status = "Pending";

    @Column(columnDefinition = "TEXT")
    private String notes;

    public void setItem(InventoryItem item) { this.item = item; }
    public void setExpectedQty(Double expectedQty) { this.expectedQty = expectedQty; }
    public void setCountedQty(Double countedQty) { this.countedQty = countedQty; }
    public void setCountDate(LocalDate countDate) { this.countDate = countDate; }
    public void setCountedBy(User countedBy) { this.countedBy = countedBy; }
    public void setStatus(String status) { this.status = status; }
    public Double getExpectedQty() { return expectedQty; }
}
