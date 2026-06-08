package com.trustagro.pharmacy.repository;

import com.trustagro.pharmacy.entity.DispensingRecord;
import com.trustagro.pharmacy.entity.DispensingType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DispensingRecordRepository extends JpaRepository<DispensingRecord, Long> {
    long countByDispensingType(DispensingType dispensingType);
}
