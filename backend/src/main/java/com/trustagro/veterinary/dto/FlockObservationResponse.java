package com.trustagro.veterinary.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FlockObservationResponse {
    private Long id;
    private LocalDate observationDate;
    private Integer respiratoryDistressScore;
    private String diarrheaType;
    private Double feedIntakeDropPercentage;
    private Integer mortalityCount;
    private String generalComments;

    public void setMortalityCount(Integer mortalityCount) { this.mortalityCount = mortalityCount; }
    public void setGeneralComments(String generalComments) { this.generalComments = generalComments; }
    public void setFeedIntakeDropPercentage(Double d) { this.feedIntakeDropPercentage = d; }
    public void setRespiratoryDistressScore(Integer i) { this.respiratoryDistressScore = i; }
    public void setDiarrheaType(String s) { this.diarrheaType = s; }
    public void setId(Long id) { this.id = id; }
    public void setObservationDate(LocalDate date) { this.observationDate = date; }
}
