package com.trustagro.inventory.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class StockInRequest {
    @NotNull
    private Long itemId;
    @Size(max = 60)
    private String batchNumber;
    @NotNull @Positive
    private Double quantity;
    @PositiveOrZero
    private BigDecimal unitCost;
    @Size(max = 120)
    private String supplier;
    private LocalDate expiryDate;
    private LocalDate dateReceived;
}
