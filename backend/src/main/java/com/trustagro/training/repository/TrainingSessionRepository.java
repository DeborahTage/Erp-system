package com.trustagro.training.repository;

import com.trustagro.training.entity.TrainingSession;
import com.trustagro.training.entity.TrainingSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {
    long countByStatus(TrainingSessionStatus status);
}
