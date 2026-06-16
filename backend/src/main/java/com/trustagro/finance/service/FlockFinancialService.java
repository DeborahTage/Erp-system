package com.trustagro.finance.service;

import com.trustagro.finance.entity.FinanceTransaction;
import com.trustagro.finance.entity.TransactionType;
import com.trustagro.finance.repository.FinanceTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FlockFinancialService {

    private final FinanceTransactionRepository transactionRepository;

    public Map<String, Object> getFlockProfitLoss(Long flockId) {
        List<FinanceTransaction> transactions = transactionRepository.findByFlockId(flockId);
        
        BigDecimal totalIncome = transactions.stream()
            .filter(t -> t.getTransactionType() == TransactionType.INCOME)
            .map(FinanceTransaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        BigDecimal totalExpense = transactions.stream()
            .filter(t -> t.getTransactionType() == TransactionType.EXPENSE)
            .map(FinanceTransaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> expenseBreakdown = new HashMap<>();
        transactions.stream()
            .filter(t -> t.getTransactionType() == TransactionType.EXPENSE)
            .forEach(t -> {
                String cat = t.getCategory() != null ? t.getCategory() : "Other";
                expenseBreakdown.put(cat, expenseBreakdown.getOrDefault(cat, BigDecimal.ZERO).add(t.getAmount()));
            });

        Map<String, Object> report = new HashMap<>();
        report.put("flockId", flockId);
        report.put("totalIncome", totalIncome);
        report.put("totalExpense", totalExpense);
        report.put("netProfit", totalIncome.subtract(totalExpense));
        report.put("expenseBreakdown", expenseBreakdown);
        
        return report;
    }
}
