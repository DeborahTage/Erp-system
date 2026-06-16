package com.trustagro.pharmacy.repository;

import com.trustagro.pharmacy.entity.PharmacyPrescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PharmacyPrescriptionRepository extends JpaRepository<PharmacyPrescription, Long> {
    List<PharmacyPrescription> findByStatus(String status);
    long countByStatus(String status);
}
