package com.trustagro.farm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FlockRequest {
    @NotBlank
    @Size(max = 60)
    private String batchCode;
    @NotNull
    private Long farmId;
    @Size(max = 80)
    private String birdType;
    @PositiveOrZero
    private Integer initialBirdCount;
    private LocalDate startDate;
    private LocalDate expectedEndDate;
}
