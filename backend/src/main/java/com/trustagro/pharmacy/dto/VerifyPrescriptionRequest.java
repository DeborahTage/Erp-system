package com.trustagro.pharmacy.dto;

import lombok.Data;
import java.util.List;

@Data
public class VerifyPrescriptionRequest {
    // Basic verification without items detailed manipulation for this iteration
    private List<Long> dispensedItemIds;
}
