package com.trustagro.farm.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "barns")
@Data
public class Barn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    private Integer capacity;

    private String barnType; // e.g. Open Sided, Controlled Environment

    private String status = "ACTIVE";

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getCapacity() { return capacity; }
    public String getBarnType() { return barnType; }
    public String getStatus() { return status; }

    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setBarnType(String barnType) { this.barnType = barnType; }
    public void setStatus(String status) { this.status = status; }
}
