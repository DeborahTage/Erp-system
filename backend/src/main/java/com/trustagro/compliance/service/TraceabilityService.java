package com.trustagro.compliance.service;

import com.trustagro.farm.entity.Flock;
import com.trustagro.farm.repository.FlockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TraceabilityService {

    private final FlockRepository flockRepository;

    public Map<String, Object> getBatchTrace(Long flockId) {
        Flock flock = flockRepository.findById(flockId).orElseThrow();
        
        Map<String, Object> trace = new HashMap<>();
        trace.put("batchCode", flock.getBatchCode());
        trace.put("hatchery", flock.getSourceHatchery());
        trace.put("breed", flock.getBreed());
        trace.put("placementDate", flock.getStartDate());
        
        // In a real system, we would join with feed delivery logs, drug usage logs, etc.
        trace.put("feedHistory", "Link to FeedDelivery records for this batch");
        trace.put("vetHistory", "Link to DrugUsageRecords for this batch");
        trace.put("barnInfo", flock.getBarn() != null ? flock.getBarn().getName() : "Unknown");
        
        return trace;
    }
}
