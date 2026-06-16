package com.trustagro.finance.dto;

import com.trustagro.finance.entity.PaymentMethod;
import com.trustagro.finance.entity.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionRequest {
    @NotNull private TransactionType transactionType;
    @NotNull @Size(max = 80) private String category;
    @NotNull @Positive private BigDecimal amount;
    private PaymentMethod paymentMethod;
    @Size(max = 80)
    private String department;
    private Long farmId;
    private Long flockId;
    private Long clientId;
    @Size(max = 60)
    private String referenceType;
    private Long referenceId;
    @Size(max = 300)
    private String description;
    private LocalDate transactionDate;
}
