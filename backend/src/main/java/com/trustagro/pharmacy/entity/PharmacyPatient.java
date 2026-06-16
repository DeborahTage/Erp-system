package com.trustagro.pharmacy.entity;

import com.trustagro.farm.entity.Farm;
import com.trustagro.farm.entity.Flock;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pharmacy_patients")
@Data
public class PharmacyPatient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flock_id")
    private Flock flock;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id")
    private Farm farm;

    private String patientName;
    private String species = "Chicken";
    private String breed;
    private Integer ageDays;
    
    @Column(precision = 6, scale = 2)
    private BigDecimal weightAvgKg;
    
    private String farmManagerName;
    private String contactPhone;
    
    private Boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public void setSpecies(String species) { this.species = species; }
    public Long getId() { return id; }
    public Long getFlockId() { return flock != null ? flock.getId() : null; }
}
