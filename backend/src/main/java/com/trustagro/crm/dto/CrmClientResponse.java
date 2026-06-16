package com.trustagro.crm.dto;

import com.trustagro.crm.entity.ClientStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CrmClientResponse {
    private Long id;
    private String clientName;
    private String phone;
    private String location;
    private String farmType;
    private String farmSize;
    private Integer numberOfBirds;
    private ClientStatus status;
    private Long assignedExtensionWorkerId;
    private String assignedExtensionWorkerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public void setId(Long id) { this.id = id; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setLocation(String location) { this.location = location; }
    public void setFarmType(String farmType) { this.farmType = farmType; }
    public void setFarmSize(String farmSize) { this.farmSize = farmSize; }
    public void setNumberOfBirds(Integer numberOfBirds) { this.numberOfBirds = numberOfBirds; }
    public void setStatus(ClientStatus status) { this.status = status; }
    public void setAssignedExtensionWorkerId(Long assignedExtensionWorkerId) { this.assignedExtensionWorkerId = assignedExtensionWorkerId; }
    public void setAssignedExtensionWorkerName(String assignedExtensionWorkerName) { this.assignedExtensionWorkerName = assignedExtensionWorkerName; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
