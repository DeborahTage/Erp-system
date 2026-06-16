package com.trustagro.crm.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_schedules")
@Data
public class DeliverySchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private CustomerOrder order;

    private LocalDate scheduledDate;

    private String routeName; // Route optimization stub

    private String vehiclePlate;

    private String driverName;

    private String status; // SCHEDULED, IN_TRANSIT, COMPLETED

    @CreationTimestamp
    private LocalDateTime createdAt;
}
