package com.trustagro.veterinary.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class HealthIssueReportRequest {
    @NotNull private Long farmId;
    @NotNull private Long flockId;
    private Long dailyFarmRecordId;
    @Size(max = 1000)
    private String symptoms;
    @PositiveOrZero
    private Integer mortalityObserved;
    @PositiveOrZero
    private Integer numberAffected;
    @Size(max = 1000)
    private String remarks;
    private LocalDate reportDate;
}
