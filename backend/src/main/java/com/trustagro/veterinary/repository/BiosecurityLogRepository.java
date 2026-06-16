package com.trustagro.veterinary.repository;

import com.trustagro.veterinary.entity.BiosecurityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BiosecurityLogRepository extends JpaRepository<BiosecurityLog, Long> {
    List<BiosecurityLog> findByFarmIdOrderByVisitTimestampDesc(Long farmId);
}
