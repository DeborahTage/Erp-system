package com.trustagro.farm.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DailyFarmRecordRequest {
    @NotNull
    private LocalDate date;
    @NotNull
    private Long farmId;
    @NotNull
    private Long flockId;
    private Integer openingBirdCount;
    @Min(0) private Integer mortality;
    @Min(0) private Integer culledBirds;
    @Min(0) private BigDecimal feedConsumed;
    @Min(0) private BigDecimal waterConsumed;
    @PositiveOrZero
    private BigDecimal averageWeight;
    @Min(0) private Integer eggProduction;
    @Min(0) private Integer damagedEggs;
    @Size(max = 1000)
    private String symptomsOrRemarks;
}
