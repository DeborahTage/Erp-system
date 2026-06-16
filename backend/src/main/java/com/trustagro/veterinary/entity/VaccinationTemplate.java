package com.trustagro.veterinary.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "vaccination_templates")
@Data
public class VaccinationTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // e.g., "Layer Standard Schedule"
    
    private String breed; // e.g., "ISA Brown"

    private Integer dayAge; // e.g., 1, 7, 14

    private String vaccineName;
    private String diseaseProtectedAgainst;
    
    private String dosage;
    private String route; // e.g., "Eye drop", "Injection"

    @Column(columnDefinition = "TEXT")
    private String instructions;

    // Accessors
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getVaccineName() { return vaccineName; }
    public void setVaccineName(String vaccineName) { this.vaccineName = vaccineName; }
    public Integer getDayAge() { return dayAge; }
    public String getDiseaseProtectedAgainst() { return diseaseProtectedAgainst; }
    public String getDosage() { return dosage; }
    public String getRoute() { return route; }
}
