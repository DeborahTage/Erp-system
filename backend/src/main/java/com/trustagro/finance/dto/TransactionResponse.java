package com.trustagro.finance.dto;

import com.trustagro.finance.entity.PaymentMethod;
import com.trustagro.finance.entity.TransactionType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TransactionResponse {
    private Long id;
    private TransactionType transactionType;
    private String category;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private String department;
    private Long farmId;
    private Long clientId;
    private String referenceType;
    private Long referenceId;
    private String description;
    private LocalDate transactionDate;
    private String recordedBy;
    private LocalDateTime createdAt;

    public void setId(Long id) { this.id = id; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }
    public void setCategory(String category) { this.category = category; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    public void setDepartment(String department) { this.department = department; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public void setReferenceType(String referenceType) { this.referenceType = referenceType; }
    public void setReferenceId(Long referenceId) { this.referenceId = referenceId; }
    public void setDescription(String description) { this.description = description; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }
    public void setRecordedBy(String recordedBy) { this.recordedBy = recordedBy; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
