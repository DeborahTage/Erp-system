package com.trustagro.inventory.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "demand_forecasts")
@Data
public class DemandForecast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem item;

    @Column(nullable = false)
    private String forecastPeriod; // e.g., monthly

    @Column(nullable = false)
    private LocalDate forecastDate;

    private Double predictedDemand;
    private Double confidenceScore;
    private Double actualDemand;

    private String algorithmUsed = "moving_average";

    @CreationTimestamp
    private LocalDateTime createdAt;

    public void setItem(InventoryItem item) { this.item = item; }
    public void setForecastPeriod(String forecastPeriod) { this.forecastPeriod = forecastPeriod; }
    public void setForecastDate(LocalDate forecastDate) { this.forecastDate = forecastDate; }
    public void setPredictedDemand(Double predictedDemand) { this.predictedDemand = predictedDemand; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    public void setAlgorithmUsed(String algorithmUsed) { this.algorithmUsed = algorithmUsed; }
}
