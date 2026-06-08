package com.trustagro.veterinary.dto;

import com.trustagro.veterinary.entity.DiseaseSeverity;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DiseaseCaseRequest {
    @NotNull private Long farmId;
    @NotNull private Long flockId;
    private LocalDate dateDetected;
    @Size(max = 1000)
    private String symptoms;
    @Size(max = 120)
    private String suspectedDisease;
    @PositiveOrZero
    private Integer numberAffected;
    @PositiveOrZero
    private Integer numberDead;
    private DiseaseSeverity severity;
}
