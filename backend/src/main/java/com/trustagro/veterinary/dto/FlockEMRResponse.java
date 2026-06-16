package com.trustagro.veterinary.dto;

import lombok.Data;
import java.util.List;

@Data
public class FlockEMRResponse {
    private Long flockId;
    private Integer ageDays;
    private String batchCode;

    public void setAgeDays(Integer i) { this.ageDays = i; }
    private String breed;

    public void setBreed(String s) { this.breed = s; }
    
    private List<DiseaseCaseResponse> diseaseHistory;
    private List<TreatmentResponse> treatments;
    private List<VaccinationResponse> vaccinations;
    private List<NecropsyResponse> necropsies;
    private List<FlockObservationResponse> observations;
    
    private Integer totalMortality;
    private Double mortalityRate;
    private Boolean isUnderWithdrawal;
    private java.time.LocalDate withdrawalEndDate;

    public void setTotalMortality(Integer m) { this.totalMortality = m; }
    public Integer getTotalMortality() { return totalMortality; }
    public void setIsUnderWithdrawal(Boolean b) { this.isUnderWithdrawal = b; }
    public void setWithdrawalEndDate(java.time.LocalDate d) { this.withdrawalEndDate = d; }
    public void setMortalityRate(Double d) { this.mortalityRate = d; }

    public void setFlockId(Long id) { this.flockId = id; }
    public void setBatchCode(String code) { this.batchCode = code; }
    public void setDiseaseHistory(List<DiseaseCaseResponse> list) { this.diseaseHistory = list; }
    public void setTreatments(List<TreatmentResponse> list) { this.treatments = list; }
    public void setVaccinations(List<VaccinationResponse> list) { this.vaccinations = list; }
    public void setNecropsies(List<NecropsyResponse> list) { this.necropsies = list; }
    public void setObservations(List<FlockObservationResponse> list) { this.observations = list; }
}
