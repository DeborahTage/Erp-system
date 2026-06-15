package com.trustagro.pharmacy.repository;

import com.trustagro.pharmacy.entity.DurAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DurAlertRepository extends JpaRepository<DurAlert, Long> {
    List<DurAlert> findByResolvedFalse();
}
