package com.trustagro.farm.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "growth_records")
@Data
public class GrowthRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flock_id", nullable = false)
    private Flock flock;

    private LocalDate samplingDate;

    private Integer sampleSize;

    private Double averageWeight; // in grams

    private Double uniformity; // CV%

    private Double breedStandardWeight; // derived from MDM for bird age

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Double getAverageWeight() { return averageWeight; }
    public Double getBreedStandardWeight() { return breedStandardWeight; }
    public Flock getFlock() { return flock; }
}
