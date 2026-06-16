package com.trustagro.crm.entity;

import com.trustagro.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "crm_clients")
@Data
public class CrmClient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String clientName;

    private String phone;
    private String location;
    private String farmType;
    private String farmSize;
    private Integer numberOfBirds;

    @Enumerated(EnumType.STRING)
    private ClientStatus status = ClientStatus.LEAD;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_extension_worker_id")
    private User assignedExtensionWorker;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public String getClientName() { return clientName; }
    public String getPhone() { return phone; }
    public String getLocation() { return location; }
    public String getFarmType() { return farmType; }
    public String getFarmSize() { return farmSize; }
    public Integer getNumberOfBirds() { return numberOfBirds; }
    public ClientStatus getStatus() { return status; }
    public User getAssignedExtensionWorker() { return assignedExtensionWorker; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setClientName(String clientName) { this.clientName = clientName; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setLocation(String location) { this.location = location; }
    public void setFarmType(String farmType) { this.farmType = farmType; }
    public void setFarmSize(String farmSize) { this.farmSize = farmSize; }
    public void setNumberOfBirds(Integer numberOfBirds) { this.numberOfBirds = numberOfBirds; }
    public void setStatus(ClientStatus status) { this.status = status; }
    public void setAssignedExtensionWorker(User assignedExtensionWorker) { this.assignedExtensionWorker = assignedExtensionWorker; }
}
