package com.trustagro.farm.service;

import com.trustagro.farm.entity.*;
import com.trustagro.farm.repository.*;
import com.trustagro.notification.service.NotificationService;
import com.trustagro.user.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FlockManagementService {

    private final GrowthRecordRepository growthRepository;
    private final EggProductionRecordRepository eggRepository;
    private final NotificationService notificationService;

    public void addGrowthRecord(GrowthRecord record) {
        // Business Logic: Alert if weight deviates > 10% from standard
        if (record.getBreedStandardWeight() != null && record.getAverageWeight() != null) {
            double deviation = Math.abs(record.getAverageWeight() - record.getBreedStandardWeight()) / record.getBreedStandardWeight();
            if (deviation > 0.1) {
                notificationService.createRoleNotification(
                    "Weight Deviation Alert",
                    "Flock " + record.getFlock().getBatchCode() + " weight deviates by " + (int)(deviation * 100) + "% from standard.",
                    Role.FARM_MANAGER
                );
            }
        }
        growthRepository.save(record);
    }

    public double calculateFCR(Long flockId) {
        // Simplified FCR: totalFeed / totalWeightGain
        // In real system, this would aggregate daily feed records and compare start weight vs current
        return 1.65; // Mock/Stub for now
    }

    public List<GrowthRecord> getGrowthHistory(Long flockId) {
        return growthRepository.findByFlockIdOrderBySamplingDateDesc(flockId);
    }

    public List<EggProductionRecord> getEggProductionHistory(Long flockId) {
        return eggRepository.findByFlockIdOrderByDateDesc(flockId);
    }
}
