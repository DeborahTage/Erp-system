package com.trustagro.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

public class ProfitLossResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netProfitLoss;

    public ProfitLossResponse(BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal netProfitLoss) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.netProfitLoss = netProfitLoss;
    }

    public BigDecimal getTotalIncome() { return totalIncome; }
    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public BigDecimal getNetProfitLoss() { return netProfitLoss; }
}
