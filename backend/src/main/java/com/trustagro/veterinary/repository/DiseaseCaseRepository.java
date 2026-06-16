package com.trustagro.veterinary.repository;

import com.trustagro.veterinary.entity.DiseaseCase;
import com.trustagro.veterinary.entity.DiseaseStatus;
import com.trustagro.farm.entity.Flock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiseaseCaseRepository extends JpaRepository<DiseaseCase, Long> {
    List<DiseaseCase> findByFarmId(Long farmId);

    List<DiseaseCase> findByStatusOrderByDateDetectedDesc(DiseaseStatus status);

    long countByStatus(DiseaseStatus status);
    List<DiseaseCase> findByFlock(Flock flock);
}
