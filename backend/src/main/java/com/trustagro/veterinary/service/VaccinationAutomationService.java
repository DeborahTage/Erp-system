package com.trustagro.veterinary.service;

import com.trustagro.farm.entity.Flock;
import com.trustagro.veterinary.entity.VaccinationSchedule;
import com.trustagro.veterinary.entity.VaccinationStatus;
import com.trustagro.veterinary.entity.VaccinationTemplate;
import com.trustagro.veterinary.repository.VaccinationScheduleRepository;
import com.trustagro.veterinary.repository.VaccinationTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VaccinationAutomationService {

    private final VaccinationTemplateRepository templateRepo;
    private final VaccinationScheduleRepository scheduleRepo;

    @Transactional
    public void generateScheduleForFlock(Flock flock) {
        List<VaccinationTemplate> templates = templateRepo.findByBreed(flock.getBreed());
        
        for (VaccinationTemplate template : templates) {
            VaccinationSchedule task = new VaccinationSchedule();
            task.setFarm(flock.getFarm());
            task.setFlock(flock);
            task.setVaccineName(template.getVaccineName());
            task.setDiseaseProtectedAgainst(template.getDiseaseProtectedAgainst());
            
            // Age in days from start date
            LocalDate scheduledDate = flock.getStartDate().plusDays(template.getDayAge());
            task.setScheduledDate(scheduledDate);
            
            task.setDosage(template.getDosage());
            task.setRoute(template.getRoute());
            task.setStatus(VaccinationStatus.SCHEDULED);
            task.setRemarks("Auto-generated from template: " + template.getName());
            
            scheduleRepo.save(task);
        }
    }
}
