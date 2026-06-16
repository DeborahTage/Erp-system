package com.trustagro.farm.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "environment_records")
@Data
public class EnvironmentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barn_id", nullable = false)
    private Barn barn;

    private LocalDateTime timestamp;

    private Double temperature; // Celsius

    private Double humidity; // %

    private Double ammoniaPPM;

    private Double co2PPM;

    private Double lightingHours;

    private String dataSource; // MANUAL or IOT

    @CreationTimestamp
    private LocalDateTime createdAt;

    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public void setDataSource(String dataSource) { this.dataSource = dataSource; }
}
