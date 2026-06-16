package com.trustagro.finance.service;

import com.trustagro.finance.entity.BusinessUnit;
import com.trustagro.finance.entity.Invoice;
import com.trustagro.finance.entity.InvoiceStatus;
import com.trustagro.finance.entity.TransactionType;
import com.trustagro.finance.repository.FinanceTransactionRepository;
import com.trustagro.finance.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.trustagro.finance.dto.ProfitLossDTO;

@Service
@RequiredArgsConstructor
public class FinanceReportService {

    private final FinanceTransactionRepository transactionRepository;
    private final InvoiceRepository invoiceRepository;

    public ProfitLossDTO getProfitAndLoss(BusinessUnit unit, LocalDate from, LocalDate to) {
        BigDecimal income;
        BigDecimal expenses;

        if (from == null) from = LocalDate.now().minusMonths(1);
        if (to == null) to = LocalDate.now();

        if (unit != null) {
            income = transactionRepository.sumByBusinessUnitAndTypeAndDateRange(unit, TransactionType.INCOME, from, to);
            expenses = transactionRepository.sumByBusinessUnitAndTypeAndDateRange(unit, TransactionType.EXPENSE, from, to);
        } else {
            income = transactionRepository.sumByTypeAndDateRange(TransactionType.INCOME, from, to);
            expenses = transactionRepository.sumByTypeAndDateRange(TransactionType.EXPENSE, from, to);
        }

        return new ProfitLossDTO(income, expenses, income.subtract(expenses));
    }

    public Map<String, Object> getARAgingReport() {
        LocalDate now = LocalDate.now();
        List<Invoice> unpaid = invoiceRepository.findByStatus(InvoiceStatus.SENT);
        unpaid.addAll(invoiceRepository.findByStatus(InvoiceStatus.PARTIALLY_PAID));
        unpaid.addAll(invoiceRepository.findByStatus(InvoiceStatus.OVERDUE));

        BigDecimal bucket0_30 = BigDecimal.ZERO;
        BigDecimal bucket31_60 = BigDecimal.ZERO;
        BigDecimal bucket61_90 = BigDecimal.ZERO;
        BigDecimal bucket90Plus = BigDecimal.ZERO;

        for (Invoice inv : unpaid) {
            long days = java.time.temporal.ChronoUnit.DAYS.between(inv.getDueDate(), now);
            BigDecimal balance = inv.getTotalAmount().subtract(inv.getPaidAmount());
            
            if (days <= 30) bucket0_30 = bucket0_30.add(balance);
            else if (days <= 60) bucket31_60 = bucket31_60.add(balance);
            else if (days <= 90) bucket61_90 = bucket61_90.add(balance);
            else bucket90Plus = bucket90Plus.add(balance);
        }

        Map<String, Object> report = new HashMap<>();
        report.put("0_30", bucket0_30);
        report.put("31_60", bucket31_60);
        report.put("61_90", bucket61_90);
        report.put("90Plus", bucket90Plus);
        report.put("totalReceivable", bucket0_30.add(bucket31_60).add(bucket61_90).add(bucket90Plus));
        
        return report;
    }
}
