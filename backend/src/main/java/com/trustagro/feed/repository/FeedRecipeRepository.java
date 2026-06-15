package com.trustagro.feed.repository;

import com.trustagro.feed.entity.FeedRecipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedRecipeRepository extends JpaRepository<FeedRecipe, Long> {
}
