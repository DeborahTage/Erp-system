package com.trustagro.veterinary.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class NecropsyResponse {
    private Long id;
    private String batchCode;
    private LocalDate necropsyDate;
    private String suspectedCauseOfDeath;
    private String finalDiagnosis;

    public void setSuspectedCauseOfDeath(String s) { this.suspectedCauseOfDeath = s; }
    public void setFinalDiagnosis(String s) { this.finalDiagnosis = s; }
    public void setBatchCode(String s) { this.batchCode = s; }
    public void setNecropsyDate(LocalDate d) { this.necropsyDate = d; }
    public void setId(Long id) { this.id = id; }
    private String performedBy;
    private LocalDateTime createdAt;

    public void setPerformedBy(String s) { this.performedBy = s; }
    public void setCreatedAt(LocalDateTime dt) { this.createdAt = dt; }
}
