package com.trustagro.veterinary.repository;

import com.trustagro.veterinary.entity.NecropsyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NecropsyRecordRepository extends JpaRepository<NecropsyRecord, Long> {
    List<NecropsyRecord> findByFlockId(Long flockId);
}
