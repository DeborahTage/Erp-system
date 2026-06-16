package com.trustagro.inventory.service;

import com.trustagro.inventory.dto.InventoryItemResponse;
import com.trustagro.inventory.entity.StockBatch;
import com.trustagro.inventory.repository.InventoryItemRepository;
import com.trustagro.inventory.repository.StockBatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InventoryReportService {

    private final InventoryItemRepository itemRepository;
    private final StockBatchRepository batchRepository;
    private final InventoryService inventoryService;

    public InventoryReportService(InventoryItemRepository itemRepository,
                                  StockBatchRepository batchRepository,
                                  InventoryService inventoryService) {
        this.itemRepository = itemRepository;
        this.batchRepository = batchRepository;
        this.inventoryService = inventoryService;
    }

    public Map<String, Object> getStockValuationReport() {
        List<com.trustagro.inventory.dto.InventoryItemResponse> items = inventoryService.getAllItems();
        BigDecimal totalValue = BigDecimal.ZERO;
        
        List<Map<String, Object>> itemValuations = items.stream().map(item -> {
            List<StockBatch> batches = batchRepository.findByItemIdOrderByDateReceivedAsc(item.getId());
            BigDecimal itemValue = batches.stream()
                    .map(b -> (b.getUnitCost() != null ? b.getUnitCost() : BigDecimal.ZERO)
                            .multiply(BigDecimal.valueOf(b.getQuantityRemaining() != null ? b.getQuantityRemaining() : 0.0)))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            Map<String, Object> map = new HashMap<>();
            map.put("itemId", item.getId());
            map.put("itemName", item.getItemName());
            map.put("sku", item.getSku());
            map.put("category", item.getCategory());
            map.put("currentStock", item.getCurrentStock());
            map.put("valuation", itemValue);
            return map;
        }).collect(Collectors.toList());

        totalValue = itemValuations.stream()
                .map(m -> (BigDecimal) m.get("valuation"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> report = new HashMap<>();
        report.put("totalValue", totalValue);
        report.put("items", itemValuations);
        report.put("generatedAt", java.time.LocalDateTime.now());
        return report;
    }

    public String generateValuationCsv() {
        Map<String, Object> report = getStockValuationReport();
        List<Map<String, Object>> items = (List<Map<String, Object>>) report.get("items");
        
        StringBuilder sb = new StringBuilder();
        sb.append("SKU,Item Name,Category,Current Stock,Valuation\n");
        for (Map<String, Object> item : items) {
            sb.append(item.get("sku")).append(",")
              .append(item.get("itemName")).append(",")
              .append(item.get("category")).append(",")
              .append(item.get("currentStock")).append(",")
              .append(item.get("valuation")).append("\n");
        }
        return sb.toString();
    }

    public String generateExpiryCsv() {
        List<StockBatch> batches = inventoryService.getExpiringItems();
        StringBuilder sb = new StringBuilder();
        sb.append("Batch Number,Item Name,Expiry Date,Quantity Remaining\n");
        for (StockBatch b : batches) {
            sb.append(b.getBatchNumber()).append(",")
              .append(b.getItem().getItemName()).append(",")
              .append(b.getExpiryDate()).append(",")
              .append(b.getQuantityRemaining()).append("\n");
        }
        return sb.toString();
    }
}
