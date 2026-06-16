package com.trustagro.finance.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "customer_wallets")
@Data
public class CustomerWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private Long clientId;

    private String clientName;

    @Column(nullable = false)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal creditLimit = BigDecimal.ZERO;

    private boolean isBlocked = false;

    public void setClientId(Long clientId) { this.clientId = clientId; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public void setCreditLimit(BigDecimal creditLimit) { this.creditLimit = creditLimit; }
    public void setBlocked(boolean blocked) { isBlocked = blocked; }

    public Long getClientId() { return clientId; }
    public String getClientName() { return clientName; }
    public BigDecimal getBalance() { return balance; }
    public BigDecimal getCreditLimit() { return creditLimit; }
    public boolean isBlocked() { return isBlocked; }
}
