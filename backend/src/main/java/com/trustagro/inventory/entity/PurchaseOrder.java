package com.trustagro.inventory.entity;

import com.trustagro.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchase_orders")
@Data
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String poNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    private String status = "Draft";

    private BigDecimal totalAmount;

    private LocalDate expectedDelivery;
    private LocalDate actualDelivery;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public void setPoNumber(String poNumber) { this.poNumber = poNumber; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }
    public void setStatus(String status) { this.status = status; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    public String getPoNumber() { return poNumber; }
    public Long getId() { return id; }
    public void setActualDelivery(LocalDate actualDelivery) { this.actualDelivery = actualDelivery; }
}
