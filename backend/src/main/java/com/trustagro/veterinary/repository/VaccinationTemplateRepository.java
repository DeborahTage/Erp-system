package com.trustagro.veterinary.repository;

import com.trustagro.veterinary.entity.VaccinationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VaccinationTemplateRepository extends JpaRepository<VaccinationTemplate, Long> {
    List<VaccinationTemplate> findByBreed(String breed);
}
