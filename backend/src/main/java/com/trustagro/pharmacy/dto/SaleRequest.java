package com.trustagro.pharmacy.dto;

import com.trustagro.finance.entity.PaymentMethod;
import com.trustagro.pharmacy.entity.DispensingType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class SaleRequest {
    @NotBlank @Size(max = 60) private String receiptNumber;
    private DispensingType dispensingType;
    private Long customerId;
    private Long farmId;
    private Long flockId;
    private Long clientId;
    private LocalDate saleDate;
    private PaymentMethod paymentMethod;
    private Long prescriptionId;
    @Valid @NotEmpty private List<SaleItemRequest> items;
}
