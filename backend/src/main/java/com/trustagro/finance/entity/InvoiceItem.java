package com.trustagro.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "invoice_items")
@Data
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private BigDecimal lineTotal;

    @Enumerated(EnumType.STRING)
    private AccountCode accountCode;

    public void setInvoice(Invoice invoice) { this.invoice = invoice; }
    public void setDescription(String description) { this.description = description; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }
    public void setAccountCode(AccountCode accountCode) { this.accountCode = accountCode; }

    public Long getId() { return id; }
    public String getDescription() { return description; }
    public Double getQuantity() { return quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public BigDecimal getLineTotal() { return lineTotal; }
    public AccountCode getAccountCode() { return accountCode; }
}
