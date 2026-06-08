package com.trustagro.pharmacy.entity;

import com.trustagro.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dispensing_records")
@Data
public class DispensingRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long prescriptionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DispensingType dispensingType;

    private Long farmId;
    private Long flockId;
    private Long customerId;
    private Long clientId;
    private Long inventoryItemId;
    private Double quantityDispensed;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispensed_by")
    private User dispensedBy;

    private LocalDate dispensingDate;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
