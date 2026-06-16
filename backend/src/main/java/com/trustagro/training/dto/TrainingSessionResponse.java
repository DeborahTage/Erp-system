package com.trustagro.training.dto;

import com.trustagro.training.entity.TrainingSessionStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class TrainingSessionResponse {
    private Long id;
    private String title;
    private String topic;
    private LocalDate trainingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String venue;
    private Integer capacity;
    private Long trainerId;
    private String trainerName;
    private TrainingSessionStatus status;
    private String description;
    private long registeredParticipants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
