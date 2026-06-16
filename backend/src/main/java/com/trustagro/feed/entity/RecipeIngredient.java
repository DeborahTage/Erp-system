package com.trustagro.feed.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "feed_recipe_ingredients")
@Data
public class RecipeIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private FeedRecipe recipe;

    @Column(nullable = false)
    private String ingredientName;

    private Double percentage;

    public void setRecipe(FeedRecipe recipe) { this.recipe = recipe; }
}
