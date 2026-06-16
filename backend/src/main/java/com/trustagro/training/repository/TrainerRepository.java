package com.trustagro.training.repository;

import com.trustagro.training.entity.Trainer;
import com.trustagro.training.entity.TrainerStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    long countByStatus(TrainerStatus status);
}
