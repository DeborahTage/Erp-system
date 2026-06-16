package com.trustagro.feed.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "feed_deliveries")
@Data
public class FeedDelivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "silo_id", nullable = false)
    private Silo silo;

    private LocalDate deliveryDate;

    private Double quantity;

    private String batchNumber;

    private String supplier;

    private Double unitCost;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Silo getSilo() { return silo; }
    public Double getQuantity() { return quantity; }
}
