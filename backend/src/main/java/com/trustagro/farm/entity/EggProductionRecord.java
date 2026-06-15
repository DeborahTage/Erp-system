package com.trustagro.farm.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "egg_production_records")
@Data
public class EggProductionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flock_id", nullable = false)
    private Flock flock;

    private LocalDate date;

    private Integer hensInProduction;

    private Integer eggsCollected;

    private Integer brokenEggs;

    private Integer gradedA;

    private Integer gradedB;

    private Integer gradedC;

    private Double feedConsumedKg;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
