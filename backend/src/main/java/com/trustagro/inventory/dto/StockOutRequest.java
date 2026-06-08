package com.trustagro.inventory.dto;

import com.trustagro.inventory.entity.IssuedToType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StockOutRequest {
    @NotNull
    private Long itemId;
    @NotNull @Positive
    private Double quantity;
    @Size(max = 160)
    private String reason;
    private IssuedToType issuedToType;
    private Long farmId;
    @Size(max = 80)
    private String department;
    @Size(max = 60)
    private String referenceType;
    private Long referenceId;
    private LocalDate movementDate;
}
