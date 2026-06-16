package com.trustagro.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invoices")
@Data
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String invoiceNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceType invoiceType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus status = InvoiceStatus.DRAFT;

    private Long clientId;
    private String clientName;

    @Column(nullable = false)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal vatAmount = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private BusinessUnit businessUnit;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceItem> items = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public void setInvoiceType(InvoiceType invoiceType) { this.invoiceType = invoiceType; }
    public void setStatus(InvoiceStatus status) { this.status = status; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public void setVatAmount(BigDecimal vatAmount) { this.vatAmount = vatAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public void setBusinessUnit(BusinessUnit businessUnit) { this.businessUnit = businessUnit; }
    public List<InvoiceItem> getItems() { return items; }

    public Long getId() { return id; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public InvoiceType getInvoiceType() { return invoiceType; }
    public InvoiceStatus getStatus() { return status; }
    public Long getClientId() { return clientId; }
    public String getClientName() { return clientName; }
    public BigDecimal getSubtotal() { return subtotal; }
    public BigDecimal getVatAmount() { return vatAmount; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public LocalDate getDueDate() { return dueDate; }
    public BusinessUnit getBusinessUnit() { return businessUnit; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void addItem(InvoiceItem item) {
        items.add(item);
        item.setInvoice(this);
    }
}
