package com.trustagro.farm.dto;

import com.trustagro.farm.entity.FarmStatus;
import com.trustagro.farm.entity.FarmType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FarmResponse {
    private Long id;
    private String farmName;
    private String location;
    private FarmType farmType;
    private Integer capacity;
    private Long assignedFarmManagerId;
    private String assignedFarmManagerName;
    private FarmStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public void setId(Long id) { this.id = id; }
    public void setFarmName(String farmName) { this.farmName = farmName; }
    public void setLocation(String location) { this.location = location; }
    public void setFarmType(FarmType farmType) { this.farmType = farmType; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setAssignedFarmManagerId(Long assignedFarmManagerId) { this.assignedFarmManagerId = assignedFarmManagerId; }
    public void setAssignedFarmManagerName(String assignedFarmManagerName) { this.assignedFarmManagerName = assignedFarmManagerName; }
    public void setStatus(FarmStatus status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
