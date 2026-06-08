package com.trustagro.farm.dto;

import com.trustagro.farm.entity.FarmType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FarmRequest {
    @NotBlank
    @Size(max = 120)
    private String farmName;
    @Size(max = 180)
    private String location;
    @NotNull
    private FarmType farmType;
    @PositiveOrZero
    private Integer capacity;
    private Long assignedFarmManagerId;
}
