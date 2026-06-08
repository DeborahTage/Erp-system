package com.trustagro.pharmacy.dto;

import com.trustagro.finance.entity.PaymentMethod;
import com.trustagro.pharmacy.entity.DispensingType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SaleResponse {
    private Long id;
    private String receiptNumber;
    private DispensingType dispensingType;
    private Long customerId;
    private String customerName;
    private Long farmId;
    private Long flockId;
    private Long clientId;
    private LocalDate saleDate;
    private PaymentMethod paymentMethod;
    private BigDecimal totalAmount;
    private String soldBy;
    private Long prescriptionId;
    private List<SaleItemResponse> items;
    private LocalDateTime createdAt;
}
