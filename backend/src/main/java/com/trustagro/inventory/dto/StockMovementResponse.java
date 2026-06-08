package com.trustagro.inventory.dto;

import com.trustagro.inventory.entity.IssuedToType;
import com.trustagro.inventory.entity.MovementType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class StockMovementResponse {
    private Long id;
    private Long itemId;
    private String itemName;
    private MovementType movementType;
    private Double quantity;
    private String reason;
    private IssuedToType issuedToType;
    private Long farmId;
    private String department;
    private String referenceType;
    private Long referenceId;
    private String performedByName;
    private LocalDate movementDate;
    private LocalDateTime createdAt;
}
