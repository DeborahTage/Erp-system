package com.trustagro.training.controller;

import com.trustagro.common.response.ApiResponse;
import com.trustagro.training.dto.*;
import com.trustagro.training.service.TrainingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/training")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','GENERAL_MANAGER','OPERATIONS_MANAGER')")
public class TrainingController {

    private final TrainingService trainingService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success(trainingService.getSummary()));
    }

    @GetMapping("/trainers")
    public ResponseEntity<ApiResponse<List<TrainerResponse>>> getTrainers() {
        return ResponseEntity.ok(ApiResponse.success(trainingService.getAllTrainers()));
    }

    @GetMapping("/trainers/{id}")
    public ResponseEntity<ApiResponse<TrainerResponse>> getTrainer(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(trainingService.getTrainerById(id)));
    }

    @PostMapping("/trainers")
    public ResponseEntity<ApiResponse<TrainerResponse>> createTrainer(@Valid @RequestBody TrainerRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Trainer created", trainingService.createTrainer(req)));
    }

    @PutMapping("/trainers/{id}")
    public ResponseEntity<ApiResponse<TrainerResponse>> updateTrainer(@PathVariable Long id, @Valid @RequestBody TrainerRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Trainer updated", trainingService.updateTrainer(id, req)));
    }

    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<List<TrainingSessionResponse>>> getSessions() {
        return ResponseEntity.ok(ApiResponse.success(trainingService.getAllSessions()));
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<ApiResponse<TrainingSessionResponse>> getSession(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(trainingService.getSessionById(id)));
    }

    @PostMapping("/sessions")
    public ResponseEntity<ApiResponse<TrainingSessionResponse>> createSession(@Valid @RequestBody TrainingSessionRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Training session created", trainingService.createSession(req)));
    }

    @PutMapping("/sessions/{id}")
    public ResponseEntity<ApiResponse<TrainingSessionResponse>> updateSession(@PathVariable Long id, @Valid @RequestBody TrainingSessionRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Training session updated", trainingService.updateSession(id, req)));
    }

    @GetMapping("/participants")
    public ResponseEntity<ApiResponse<List<TrainingParticipantResponse>>> getParticipants(@RequestParam(required = false) Long sessionId) {
        return ResponseEntity.ok(ApiResponse.success(trainingService.getAllParticipants(sessionId)));
    }

    @GetMapping("/participants/{id}")
    public ResponseEntity<ApiResponse<TrainingParticipantResponse>> getParticipant(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(trainingService.getParticipantById(id)));
    }

    @PostMapping("/participants")
    public ResponseEntity<ApiResponse<TrainingParticipantResponse>> createParticipant(@Valid @RequestBody TrainingParticipantRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Participant registered", trainingService.createParticipant(req)));
    }

    @PutMapping("/participants/{id}")
    public ResponseEntity<ApiResponse<TrainingParticipantResponse>> updateParticipant(@PathVariable Long id, @Valid @RequestBody TrainingParticipantRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Participant updated", trainingService.updateParticipant(id, req)));
    }
}
