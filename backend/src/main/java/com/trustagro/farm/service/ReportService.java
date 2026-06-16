package com.trustagro.farm.service;

import com.trustagro.farm.repository.DailyFarmRecordRepository;
import com.trustagro.finance.repository.FinanceTransactionRepository;
import com.trustagro.inventory.repository.InventoryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final DailyFarmRecordRepository dailyRecordRepository;
    private final FinanceTransactionRepository financeRepository;
    private final InventoryItemRepository inventoryRepository;

    public Map<String, Object> getOperationalSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRecords", dailyRecordRepository.count());
        // Add more operational snippets here
        return summary;
    }

    public Map<String, Object> getFinancialSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("transactionCount", financeRepository.count());
        return summary;
    }

    public Map<String, Object> getInventorySummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("activeSkus", inventoryRepository.count());
        return summary;
    }
}
