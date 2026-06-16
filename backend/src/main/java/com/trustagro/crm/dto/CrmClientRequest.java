package com.trustagro.crm.dto;

import com.trustagro.crm.entity.ClientStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CrmClientRequest {
    @NotBlank @Size(max = 120) private String clientName;
    @Pattern(regexp = "^(\\+?[0-9 .()-]{7,20})?$", message = "Phone number format is invalid")
    private String phone;
    @Size(max = 180)
    private String location;
    @Size(max = 80)
    private String farmType;
    @Size(max = 80)
    private String farmSize;
    @PositiveOrZero
    private Integer numberOfBirds;
    private ClientStatus status;
    private Long assignedExtensionWorkerId;

    public String getClientName() { return clientName; }
    public String getPhone() { return phone; }
    public String getLocation() { return location; }
    public String getFarmType() { return farmType; }
    public String getFarmSize() { return farmSize; }
    public Integer getNumberOfBirds() { return numberOfBirds; }
    public ClientStatus getStatus() { return status; }
    public Long getAssignedExtensionWorkerId() { return assignedExtensionWorkerId; }
}
