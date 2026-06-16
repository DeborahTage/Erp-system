package com.trustagro.crm.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class FarmVisitResponse {
    private Long id;
    private Long clientId;
    private String clientName;
    private LocalDate visitDate;
    private String visitedBy;
    private String purpose;
    private String observation;
    private String adviceGiven;
    private LocalDate nextFollowUpDate;
    private LocalDateTime createdAt;

    public void setId(Long id) { this.id = id; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }
    public void setVisitedBy(String visitedBy) { this.visitedBy = visitedBy; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public void setObservation(String observation) { this.observation = observation; }
    public void setAdviceGiven(String adviceGiven) { this.adviceGiven = adviceGiven; }
    public void setNextFollowUpDate(LocalDate nextFollowUpDate) { this.nextFollowUpDate = nextFollowUpDate; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
