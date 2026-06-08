package com.trustagro.crm.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FarmVisitRequest {
    @NotNull private Long clientId;
    private LocalDate visitDate;
    @Size(max = 200)
    private String purpose;
    @Size(max = 1200)
    private String observation;
    @Size(max = 1200)
    private String adviceGiven;
    private LocalDate nextFollowUpDate;
}
