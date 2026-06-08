package com.trustagro.pharmacy.entity;

import com.trustagro.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "drug_usage_records")
@Data
public class DrugUsageRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long farmId;

    private Long flockId;
    private Long diseaseCaseId;
    private Long prescriptionId;

    @Column(nullable = false)
    private Long inventoryItemId;

    private Double quantityUsed;
    private String purpose;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "used_by")
    private User usedBy;

    private LocalDate usageDate;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
