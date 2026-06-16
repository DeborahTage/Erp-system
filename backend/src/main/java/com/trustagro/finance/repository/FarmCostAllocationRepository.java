package com.trustagro.finance.repository;

import com.trustagro.finance.entity.FarmCostAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FarmCostAllocationRepository extends JpaRepository<FarmCostAllocation, Long> {
    List<FarmCostAllocation> findByFarmId(Long farmId);
    List<FarmCostAllocation> findByFlockId(Long flockId);
}
