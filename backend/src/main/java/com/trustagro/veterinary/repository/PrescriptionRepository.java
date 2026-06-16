package com.trustagro.veterinary.repository;

import com.trustagro.veterinary.entity.Prescription;
import com.trustagro.veterinary.entity.PrescriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByStatus(PrescriptionStatus status);
    List<Prescription> findByFarmId(Long farmId);
    List<Prescription> findByFlockId(Long flockId);
}
