package com.trustagro.pharmacy.repository;

import com.trustagro.pharmacy.entity.PharmacyPatient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PharmacyPatientRepository extends JpaRepository<PharmacyPatient, Long> {
    @Query("SELECT p FROM PharmacyPatient p WHERE p.flock.id = :flockId")
    Optional<PharmacyPatient> findByFlockId(@Param("flockId") Long flockId);
}
