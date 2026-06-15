package com.trustagro.farm.repository;

import com.trustagro.farm.entity.EnvironmentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnvironmentRecordRepository extends JpaRepository<EnvironmentRecord, Long> {
    List<EnvironmentRecord> findByBarnIdOrderByTimestampDesc(Long barnId);
}
