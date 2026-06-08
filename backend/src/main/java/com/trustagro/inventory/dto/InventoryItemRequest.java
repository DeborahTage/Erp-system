package com.trustagro.inventory.dto;

import com.trustagro.inventory.entity.ItemCategory;
import com.trustagro.inventory.entity.ItemUnit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class InventoryItemRequest {
    @NotBlank
    @Size(max = 120)
    private String itemName;
    @NotNull
    private ItemCategory category;
    @NotNull
    private ItemUnit unit;
    @PositiveOrZero
    private Double minimumStockLevel;
    private boolean expiryRequired;
}
