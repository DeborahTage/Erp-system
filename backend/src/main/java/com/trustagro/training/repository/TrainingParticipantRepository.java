package com.trustagro.training.repository;

import com.trustagro.training.entity.TrainingParticipant;
import com.trustagro.training.entity.TrainingParticipantStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingParticipantRepository extends JpaRepository<TrainingParticipant, Long> {
    List<TrainingParticipant> findBySessionId(Long sessionId);
    long countByStatus(TrainingParticipantStatus status);
    long countBySessionId(Long sessionId);
}
