package com.trustagro.farm.repository;

import com.trustagro.farm.entity.EggProductionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EggProductionRecordRepository extends JpaRepository<EggProductionRecord, Long> {
    List<EggProductionRecord> findByFlockIdOrderByDateDesc(Long flockId);
}
