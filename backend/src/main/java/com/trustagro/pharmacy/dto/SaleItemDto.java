package com.trustagro.pharmacy.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SaleItemDto {
    private Long itemId;
    private BigDecimal qty;
    private BigDecimal unitPrice;

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public BigDecimal getQty() { return qty; }
    public void setQty(BigDecimal qty) { this.qty = qty; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
}
