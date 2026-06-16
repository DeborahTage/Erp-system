package com.trustagro.training.service;

import com.trustagro.common.exception.BusinessException;
import com.trustagro.common.exception.ResourceNotFoundException;
import com.trustagro.training.dto.*;
import com.trustagro.training.entity.*;
import com.trustagro.training.repository.TrainerRepository;
import com.trustagro.training.repository.TrainingParticipantRepository;
import com.trustagro.training.repository.TrainingSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainingService {

    private final TrainerRepository trainerRepository;
    private final TrainingSessionRepository sessionRepository;
    private final TrainingParticipantRepository participantRepository;

    public Map<String, Object> getSummary() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalTrainers", trainerRepository.count());
        data.put("activeTrainers", trainerRepository.countByStatus(TrainerStatus.ACTIVE));
        data.put("plannedSessions", sessionRepository.countByStatus(TrainingSessionStatus.PLANNED));
        data.put("completedSessions", sessionRepository.countByStatus(TrainingSessionStatus.COMPLETED));
        data.put("registeredParticipants", participantRepository.countByStatus(TrainingParticipantStatus.REGISTERED));
        return data;
    }

    public List<TrainerResponse> getAllTrainers() {
        return trainerRepository.findAll().stream()
                .map(this::toTrainerResponse)
                .collect(Collectors.toList());
    }

    public TrainerResponse getTrainerById(Long id) {
        return toTrainerResponse(findTrainerById(id));
    }

    public TrainerResponse createTrainer(TrainerRequest req) {
        Trainer trainer = new Trainer();
        mapTrainerRequest(req, trainer);
        return toTrainerResponse(trainerRepository.save(trainer));
    }

    public TrainerResponse updateTrainer(Long id, TrainerRequest req) {
        Trainer trainer = findTrainerById(id);
        mapTrainerRequest(req, trainer);
        return toTrainerResponse(trainerRepository.save(trainer));
    }

    public List<TrainingSessionResponse> getAllSessions() {
        return sessionRepository.findAll().stream()
                .map(this::toSessionResponse)
                .collect(Collectors.toList());
    }

    public TrainingSessionResponse getSessionById(Long id) {
        return toSessionResponse(findSessionById(id));
    }

    public TrainingSessionResponse createSession(TrainingSessionRequest req) {
        TrainingSession session = new TrainingSession();
        mapSessionRequest(req, session);
        return toSessionResponse(sessionRepository.save(session));
    }

    public TrainingSessionResponse updateSession(Long id, TrainingSessionRequest req) {
        TrainingSession session = findSessionById(id);
        mapSessionRequest(req, session);
        return toSessionResponse(sessionRepository.save(session));
    }

    public List<TrainingParticipantResponse> getAllParticipants(Long sessionId) {
        List<TrainingParticipant> participants = sessionId != null
                ? participantRepository.findBySessionId(sessionId)
                : participantRepository.findAll();
        return participants.stream().map(this::toParticipantResponse).collect(Collectors.toList());
    }

    public TrainingParticipantResponse getParticipantById(Long id) {
        return toParticipantResponse(findParticipantById(id));
    }

    public TrainingParticipantResponse createParticipant(TrainingParticipantRequest req) {
        TrainingParticipant participant = new TrainingParticipant();
        mapParticipantRequest(req, participant);
        return toParticipantResponse(participantRepository.save(participant));
    }

    public TrainingParticipantResponse updateParticipant(Long id, TrainingParticipantRequest req) {
        TrainingParticipant participant = findParticipantById(id);
        mapParticipantRequest(req, participant);
        return toParticipantResponse(participantRepository.save(participant));
    }

    private void mapTrainerRequest(TrainerRequest req, Trainer trainer) {
        if (isBlank(req.getFullName())) {
            throw new BusinessException("Trainer name is required");
        }
        trainer.setFullName(req.getFullName().trim());
        trainer.setEmail(trimToNull(req.getEmail()));
        trainer.setPhone(trimToNull(req.getPhone()));
        trainer.setSpecialization(trimToNull(req.getSpecialization()));
        trainer.setOrganization(trimToNull(req.getOrganization()));
        trainer.setNotes(trimToNull(req.getNotes()));
        if (req.getStatus() != null) {
            trainer.setStatus(req.getStatus());
        } else if (trainer.getStatus() == null) {
            trainer.setStatus(TrainerStatus.ACTIVE);
        }
    }

    private void mapSessionRequest(TrainingSessionRequest req, TrainingSession session) {
        if (isBlank(req.getTitle())) {
            throw new BusinessException("Training title is required");
        }
        if (req.getTrainingDate() == null) {
            throw new BusinessException("Training date is required");
        }
        if (req.getStartTime() != null && req.getEndTime() != null && req.getEndTime().isBefore(req.getStartTime())) {
            throw new BusinessException("End time cannot be before start time");
        }
        session.setTitle(req.getTitle().trim());
        session.setTopic(trimToNull(req.getTopic()));
        session.setTrainingDate(req.getTrainingDate());
        session.setStartTime(req.getStartTime());
        session.setEndTime(req.getEndTime());
        session.setVenue(trimToNull(req.getVenue()));
        session.setCapacity(req.getCapacity());
        session.setDescription(trimToNull(req.getDescription()));
        if (req.getTrainerId() != null) {
            session.setTrainer(findTrainerById(req.getTrainerId()));
        } else {
            session.setTrainer(null);
        }
        if (req.getStatus() != null) {
            session.setStatus(req.getStatus());
        } else if (session.getStatus() == null) {
            session.setStatus(TrainingSessionStatus.PLANNED);
        }
    }

    private void mapParticipantRequest(TrainingParticipantRequest req, TrainingParticipant participant) {
        if (isBlank(req.getFullName())) {
            throw new BusinessException("Participant name is required");
        }
        TrainingSession session = findSessionById(req.getSessionId());
        participant.setFullName(req.getFullName().trim());
        participant.setEmail(trimToNull(req.getEmail()));
        participant.setPhone(trimToNull(req.getPhone()));
        participant.setOrganization(trimToNull(req.getOrganization()));
        participant.setParticipantRole(trimToNull(req.getParticipantRole()));
        participant.setLocation(trimToNull(req.getLocation()));
        participant.setSession(session);
        participant.setNotes(trimToNull(req.getNotes()));
        if (req.getStatus() != null) {
            participant.setStatus(req.getStatus());
        } else if (participant.getStatus() == null) {
            participant.setStatus(TrainingParticipantStatus.REGISTERED);
        }
    }

    private Trainer findTrainerById(Long id) {
        return trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found: " + id));
    }

    private TrainingSession findSessionById(Long id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training session not found: " + id));
    }

    private TrainingParticipant findParticipantById(Long id) {
        return participantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training participant not found: " + id));
    }

    private TrainerResponse toTrainerResponse(Trainer trainer) {
        TrainerResponse response = new TrainerResponse();
        response.setId(trainer.getId());
        response.setFullName(trainer.getFullName());
        response.setEmail(trainer.getEmail());
        response.setPhone(trainer.getPhone());
        response.setSpecialization(trainer.getSpecialization());
        response.setOrganization(trainer.getOrganization());
        response.setStatus(trainer.getStatus());
        response.setNotes(trainer.getNotes());
        response.setCreatedAt(trainer.getCreatedAt());
        response.setUpdatedAt(trainer.getUpdatedAt());
        return response;
    }

    private TrainingSessionResponse toSessionResponse(TrainingSession session) {
        TrainingSessionResponse response = new TrainingSessionResponse();
        response.setId(session.getId());
        response.setTitle(session.getTitle());
        response.setTopic(session.getTopic());
        response.setTrainingDate(session.getTrainingDate());
        response.setStartTime(session.getStartTime());
        response.setEndTime(session.getEndTime());
        response.setVenue(session.getVenue());
        response.setCapacity(session.getCapacity());
        response.setStatus(session.getStatus());
        response.setDescription(session.getDescription());
        response.setCreatedAt(session.getCreatedAt());
        response.setUpdatedAt(session.getUpdatedAt());
        response.setRegisteredParticipants(participantRepository.countBySessionId(session.getId()));
        if (session.getTrainer() != null) {
            response.setTrainerId(session.getTrainer().getId());
            response.setTrainerName(session.getTrainer().getFullName());
        }
        return response;
    }

    private TrainingParticipantResponse toParticipantResponse(TrainingParticipant participant) {
        TrainingParticipantResponse response = new TrainingParticipantResponse();
        response.setId(participant.getId());
        response.setFullName(participant.getFullName());
        response.setEmail(participant.getEmail());
        response.setPhone(participant.getPhone());
        response.setOrganization(participant.getOrganization());
        response.setParticipantRole(participant.getParticipantRole());
        response.setLocation(participant.getLocation());
        response.setStatus(participant.getStatus());
        response.setNotes(participant.getNotes());
        response.setCreatedAt(participant.getCreatedAt());
        response.setUpdatedAt(participant.getUpdatedAt());
        if (participant.getSession() != null) {
            response.setSessionId(participant.getSession().getId());
            response.setSessionTitle(participant.getSession().getTitle());
        }
        return response;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
