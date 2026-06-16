package com.trustagro.veterinary.entity;

import com.trustagro.farm.entity.Farm;
import com.trustagro.farm.entity.Flock;
import com.trustagro.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vaccination_schedules")
@Data
public class VaccinationSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id")
    private Farm farm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flock_id")
    private Flock flock;

    private String vaccineName;
    private String vaccineType;
    private String diseaseProtectedAgainst;
    private String batchNumber;
    private LocalDate nextDoseDate;
    private LocalDate scheduledDate;
    private LocalDate actualDate;
    private String dosage;
    private String route;
    private String responsiblePerson;

    @Enumerated(EnumType.STRING)
    private VaccinationStatus status = VaccinationStatus.SCHEDULED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "given_by")
    private User givenBy;

    private String remarks;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public String getVaccineName() { return vaccineName; }
    public VaccinationStatus getStatus() { return status; }
    public LocalDate getScheduledDate() { return scheduledDate; }
    public User getGivenBy() { return givenBy; }
    public String getRemarks() { return remarks; }
    public LocalDate getActualDate() { return actualDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setFarm(Farm farm) { this.farm = farm; }
    public void setFlock(Flock flock) { this.flock = flock; }
    public void setVaccineName(String vaccineName) { this.vaccineName = vaccineName; }
    public void setDiseaseProtectedAgainst(String diseaseProtectedAgainst) { this.diseaseProtectedAgainst = diseaseProtectedAgainst; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public void setRoute(String route) { this.route = route; }
    public void setResponsiblePerson(String responsiblePerson) { this.responsiblePerson = responsiblePerson; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public void setStatus(VaccinationStatus status) { this.status = status; }
    public void setActualDate(LocalDate actualDate) { this.actualDate = actualDate; }
    public Flock getFlock() { return flock; }
    public Farm getFarm() { return farm; }
    public String getDiseaseProtectedAgainst() { return diseaseProtectedAgainst; }
    public String getDosage() { return dosage; }
    public String getRoute() { return route; }
    public String getResponsiblePerson() { return responsiblePerson; }
    public void setGivenBy(User givenBy) { this.givenBy = givenBy; }
}
