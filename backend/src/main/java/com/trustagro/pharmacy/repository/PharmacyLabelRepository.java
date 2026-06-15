package com.trustagro.pharmacy.repository;

import com.trustagro.pharmacy.entity.PharmacyLabel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PharmacyLabelRepository extends JpaRepository<PharmacyLabel, Long> {
}
