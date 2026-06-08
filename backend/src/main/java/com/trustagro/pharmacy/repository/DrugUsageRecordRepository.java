package com.trustagro.pharmacy.repository;

import com.trustagro.pharmacy.entity.DrugUsageRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DrugUsageRecordRepository extends JpaRepository<DrugUsageRecord, Long> {
}
