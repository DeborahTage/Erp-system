package com.trustagro.feed.entity;

import com.trustagro.farm.entity.Barn;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "silos")
@Data
public class Silo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barn_id", nullable = false)
    private Barn barn;

    private Double capacity; // in Kg

    private Double currentLevel; // in Kg

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_recipe_id")
    private FeedRecipe currentRecipe;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public Double getCapacity() { return capacity; }
    public Double getCurrentLevel() { return currentLevel; }
    public void setCurrentLevel(Double currentLevel) { this.currentLevel = currentLevel; }
}
