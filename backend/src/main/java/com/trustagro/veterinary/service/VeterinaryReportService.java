package com.trustagro.veterinary.service;

import com.trustagro.veterinary.dto.DrugUsageReportResponse;
import com.trustagro.veterinary.entity.Prescription;
import com.trustagro.veterinary.repository.PrescriptionRepository;
import com.trustagro.inventory.repository.InventoryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VeterinaryReportService {
    
    private final PrescriptionRepository prescriptionRepository;
    private final InventoryItemRepository inventoryItemRepository;

    public DrugUsageReportResponse generateDrugUsageReport(LocalDate startDate, LocalDate endDate, Long flockId) {
        List<Prescription> prescriptions = prescriptionRepository.findAll();
        
        // Filter out those outside date or different flockId
        if (startDate != null) {
            prescriptions = prescriptions.stream().filter(p -> !p.getCreatedAt().toLocalDate().isBefore(startDate)).collect(Collectors.toList());
        }
        if (endDate != null) {
            prescriptions = prescriptions.stream().filter(p -> !p.getCreatedAt().toLocalDate().isAfter(endDate)).collect(Collectors.toList());
        }
        if (flockId != null) {
            prescriptions = prescriptions.stream().filter(p -> flockId.equals(p.getFlockId())).collect(Collectors.toList());
        }

        // Aggregate
        double totalCost = 0.0;
        int totalPrescriptions = prescriptions.size();

        Map<String, Double> costByDrug = prescriptions.stream()
            .collect(Collectors.groupingBy(
                Prescription::getDrugName,
                Collectors.summingDouble(p -> calculateCost(p))
            ));
            
        Map<String, Double> quantityByDrug = prescriptions.stream()
            .collect(Collectors.groupingBy(
                Prescription::getDrugName,
                Collectors.summingDouble(p -> p.getQuantity() != null ? p.getQuantity() : 0.0)
            ));

        for (Double cost : costByDrug.values()) {
            totalCost += cost;
        }

        DrugUsageReportResponse report = new DrugUsageReportResponse();
        report.setTotalCost(totalCost);
        report.setTotalPrescriptions(totalPrescriptions);
        report.setCostByDrug(costByDrug);
        report.setQuantityByDrug(quantityByDrug);
        return report;
    }

    private double calculateCost(Prescription p) {
        return 0.0; // unitPrice missing in InventoryItem, cost tracking handled in StockBatch
    }
}
