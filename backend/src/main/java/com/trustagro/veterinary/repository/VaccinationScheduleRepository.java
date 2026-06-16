package com.trustagro.veterinary.repository;

import com.trustagro.veterinary.entity.VaccinationSchedule;
import com.trustagro.veterinary.entity.VaccinationStatus;
import com.trustagro.farm.entity.Flock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface VaccinationScheduleRepository extends JpaRepository<VaccinationSchedule, Long> {
    List<VaccinationSchedule> findByStatus(VaccinationStatus status);
    List<VaccinationSchedule> findByScheduledDateBeforeAndStatus(LocalDate date, VaccinationStatus status);
    List<VaccinationSchedule> findByScheduledDateAfterAndStatus(LocalDate date, VaccinationStatus status);
    List<VaccinationSchedule> findByScheduledDateBetweenAndStatus(LocalDate start, LocalDate end, VaccinationStatus status);
    List<VaccinationSchedule> findByScheduledDateBetween(LocalDate start, LocalDate end);
    List<VaccinationSchedule> findByFlock(Flock flock);
}
