package com.trustagro.farm.entity;

import com.trustagro.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "farms")
@Data
public class Farm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String farmName;

    private String location;

    @Enumerated(EnumType.STRING)
    private FarmType farmType;

    private Integer capacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_farm_manager_id")
    private User assignedFarmManager;

    @Enumerated(EnumType.STRING)
    private FarmStatus status = FarmStatus.ACTIVE;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public String getFarmName() { return farmName; }
    public String getLocation() { return location; }
    public FarmType getFarmType() { return farmType; }
    public Integer getCapacity() { return capacity; }
    public User getAssignedFarmManager() { return assignedFarmManager; }
    public FarmStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setFarmName(String farmName) { this.farmName = farmName; }
    public void setLocation(String location) { this.location = location; }
    public void setFarmType(FarmType farmType) { this.farmType = farmType; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setAssignedFarmManager(User assignedFarmManager) { this.assignedFarmManager = assignedFarmManager; }
    public void setStatus(FarmStatus status) { this.status = status; }
}
