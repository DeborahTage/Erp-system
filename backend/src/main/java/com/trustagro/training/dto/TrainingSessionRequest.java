package com.trustagro.training.dto;

import com.trustagro.training.entity.TrainingSessionStatus;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TrainingSessionRequest {
    @Size(max = 160)
    private String title;

    @Size(max = 160)
    private String topic;

    private LocalDate trainingDate;

    private LocalTime startTime;

    private LocalTime endTime;

    @Size(max = 180)
    private String venue;

    @Positive
    private Integer capacity;

    private Long trainerId;

    private TrainingSessionStatus status;

    @Size(max = 1200)
    private String description;
}
