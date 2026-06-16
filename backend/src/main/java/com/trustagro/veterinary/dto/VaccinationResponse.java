package com.trustagro.veterinary.dto;

import com.trustagro.veterinary.entity.VaccinationStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class VaccinationResponse {
    private Long id;
    private Long farmId;
    private String farmName;
    private Long flockId;
    private String batchCode;
    private String vaccineName;
    private String diseaseProtectedAgainst;
    private LocalDate scheduledDate;
    private LocalDate actualDate;
    private String dosage;
    private String route;
    private String responsiblePerson;
    private VaccinationStatus status;
    private String givenBy;
    private String remarks;
    private LocalDateTime createdAt;

    public void setId(Long id) { this.id = id; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }
    public void setFarmName(String farmName) { this.farmName = farmName; }
    public void setFlockId(Long flockId) { this.flockId = flockId; }
    public void setBatchCode(String batchCode) { this.batchCode = batchCode; }
    public void setVaccineName(String vaccineName) { this.vaccineName = vaccineName; }
    public void setDiseaseProtectedAgainst(String diseaseProtectedAgainst) { this.diseaseProtectedAgainst = diseaseProtectedAgainst; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }
    public void setActualDate(LocalDate actualDate) { this.actualDate = actualDate; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public void setRoute(String route) { this.route = route; }
    public void setResponsiblePerson(String responsiblePerson) { this.responsiblePerson = responsiblePerson; }
    public void setStatus(VaccinationStatus status) { this.status = status; }
    public void setGivenBy(String givenBy) { this.givenBy = givenBy; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
