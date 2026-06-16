package com.trustagro.inventory.service;

import com.trustagro.inventory.entity.StockBatch;
import com.trustagro.inventory.repository.StockBatchRepository;
import com.trustagro.notification.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class InventoryScheduler {

    private static final Logger log = LoggerFactory.getLogger(InventoryScheduler.class);

    private final StockBatchRepository batchRepository;
    private final NotificationService notificationService;

    public InventoryScheduler(StockBatchRepository batchRepository,
                                NotificationService notificationService) {
        this.batchRepository = batchRepository;
        this.notificationService = notificationService;
    }

    // Daily at 1 AM
    @Scheduled(cron = "0 0 1 * * *")
    public void scanExpiringItems() {
        log.info("Starting automated expiry scan...");
        LocalDate today = LocalDate.now();
        
        // Multi-level alerts logic
        int[] noticeDays = {90, 60, 30, 7};
        
        for (int days : noticeDays) {
            LocalDate targetDate = today.plusDays(days);
            List<StockBatch> batches = batchRepository.findByExpiryDate(targetDate);
            for (StockBatch batch : batches) {
                if (batch.getQuantityRemaining() > 0) {
                    notificationService.createExpiryAlert(
                        batch.getItem().getItemName() + " (Batch: " + batch.getBatchNumber() + ")",
                        String.valueOf(days) + " days (" + batch.getExpiryDate() + ")"
                    );
                }
            }
        }
        
        // Also alert for items that expired today
        List<StockBatch> expiredToday = batchRepository.findByExpiryDate(today);
        for (StockBatch batch : expiredToday) {
            if (batch.getQuantityRemaining() > 0) {
                notificationService.createExpiryAlert(
                    batch.getItem().getItemName() + " (Batch: " + batch.getBatchNumber() + ")",
                    "EXPIRED TODAY"
                );
            }
        }
    }
}
