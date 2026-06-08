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
}
