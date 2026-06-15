package com.trustagro.veterinary.dto;

import lombok.Data;
import java.util.Map;

@Data
public class DrugUsageReportResponse {
    private double totalCost;
    private int totalPrescriptions;
    private Map<String, Double> costByDrug;
    private Map<String, Double> quantityByDrug;

    public void setTotalCost(double totalCost) { this.totalCost = totalCost; }
    public void setTotalPrescriptions(int totalPrescriptions) { this.totalPrescriptions = totalPrescriptions; }
    public void setCostByDrug(Map<String, Double> costByDrug) { this.costByDrug = costByDrug; }
    public void setQuantityByDrug(Map<String, Double> quantityByDrug) { this.quantityByDrug = quantityByDrug; }
}
