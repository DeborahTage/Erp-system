package com.trustagro.pharmacy.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "dur_alerts")
@Data
public class DurAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id")
    private PharmacyPrescription prescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id")
    private PharmacySale sale;

    @Column(length = 50)
    private String alertType;

    @Column(length = 10)
    private String severity;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    private Boolean resolved = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public void setAlertType(String alertType) { this.alertType = alertType; }
    public void setSeverity(String severity) { this.severity = severity; }
    public void setMessage(String message) { this.message = message; }
    public String getMessage() { return message; }
    public void setPrescription(PharmacyPrescription prescription) { this.prescription = prescription; }
}
