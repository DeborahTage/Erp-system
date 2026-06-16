package com.trustagro.veterinary.repository;

import com.trustagro.veterinary.entity.FlockObservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlockObservationRepository extends JpaRepository<FlockObservation, Long> {
    List<FlockObservation> findByFlockId(Long flockId);
    Optional<FlockObservation> findByFlockIdAndObservationDate(Long flockId, LocalDate date);
}
