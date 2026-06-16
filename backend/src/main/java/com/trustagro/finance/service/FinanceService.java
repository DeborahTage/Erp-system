package com.trustagro.finance.service;

import com.trustagro.common.exception.ResourceNotFoundException;
import com.trustagro.finance.entity.*;
import com.trustagro.finance.repository.ChartOfAccountRepository;
import com.trustagro.finance.repository.FinanceTransactionRepository;
import com.trustagro.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final FinanceTransactionRepository transactionRepository;
    private final ChartOfAccountRepository chartOfAccountRepository;
    private final UserRepository userRepository;

    @Transactional
    public FinanceTransaction postRevenue(BigDecimal amount, BusinessUnit unit, AccountCode accountCode,
                                         String description, String referenceType, Long referenceId) {
        return postTransaction(TransactionType.INCOME, amount, unit, accountCode, description, referenceType, referenceId);
    }

    @Transactional
    public FinanceTransaction postExpense(BigDecimal amount, BusinessUnit unit, AccountCode accountCode,
                                         String description, String referenceType, Long referenceId) {
        return postTransaction(TransactionType.EXPENSE, amount, unit, accountCode, description, referenceType, referenceId);
    }

    @Transactional
    public FinanceTransaction postTransaction(TransactionType type, BigDecimal amount, BusinessUnit unit,
                                             AccountCode accountCode, String description,
                                             String referenceType, Long referenceId) {
        FinanceTransaction t = new FinanceTransaction();
        t.setTransactionType(type);
        t.setAmount(amount);
        t.setBusinessUnit(unit != null ? unit : BusinessUnit.GENERAL);
        t.setAccountCode(accountCode);
        t.setDescription(description);
        t.setReferenceType(referenceType);
        t.setReferenceId(referenceId);
        t.setTransactionDate(LocalDate.now());

        String email = SecurityContextHolder.getContext().getAuthentication() != null 
                ? SecurityContextHolder.getContext().getAuthentication().getName() : "system";
        userRepository.findByEmail(email).ifPresent(t::setRecordedBy);

        // Update Chart of Accounts balance
        if (accountCode != null) {
            ChartOfAccount coa = chartOfAccountRepository.findByAccountCode(accountCode.getCode())
                    .orElseGet(() -> {
                        ChartOfAccount newCoa = new ChartOfAccount();
                        newCoa.setAccountCode(accountCode.getCode());
                        newCoa.setAccountName(accountCode.getName());
                        newCoa.setAccountType(accountCode.getAccountType());
                        newCoa.setBusinessUnit(accountCode.getUnit());
                        return chartOfAccountRepository.save(newCoa);
                    });
            
            BigDecimal currentBalance = coa.getBalance() != null ? coa.getBalance() : BigDecimal.ZERO;
            if (type == TransactionType.INCOME) {
                coa.setBalance(currentBalance.add(amount));
            } else {
                coa.setBalance(currentBalance.subtract(amount));
            }
            chartOfAccountRepository.save(coa);
        }

        return transactionRepository.save(t);
    }

    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRevenue", transactionRepository.sumByType(TransactionType.INCOME));
        summary.put("totalExpenses", transactionRepository.sumByType(TransactionType.EXPENSE));
        
        BigDecimal revenue = (BigDecimal) summary.get("totalRevenue");
        BigDecimal expenses = (BigDecimal) summary.get("totalExpenses");
        summary.put("netProfit", revenue.subtract(expenses));
        
        // Per-unit breakdown
        Map<String, BigDecimal> unitRevenue = new HashMap<>();
        for (BusinessUnit unit : BusinessUnit.values()) {
            unitRevenue.put(unit.name(), transactionRepository.sumByBusinessUnitAndType(unit, TransactionType.INCOME));
        }
        summary.put("unitRevenue", unitRevenue);
        
        return summary;
    }

    public List<FinanceTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
