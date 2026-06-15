package com.trustagro.feed.service;

import com.trustagro.feed.entity.*;
import com.trustagro.feed.repository.*;
import com.trustagro.notification.service.NotificationService;
import com.trustagro.user.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedService {

    private final FeedRecipeRepository recipeRepository;
    private final SiloRepository siloRepository;
    private final FeedDeliveryRepository deliveryRepository;
    private final NotificationService notificationService;

    public List<FeedRecipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    @Transactional
    public FeedRecipe createRecipe(FeedRecipe recipe) {
        if (recipe.getIngredients() != null) {
            recipe.getIngredients().forEach(i -> i.setRecipe(recipe));
        }
        return recipeRepository.save(recipe);
    }

    public List<Silo> getAllSilos() {
        return siloRepository.findAll();
    }

    @Transactional
    public void logDelivery(FeedDelivery delivery) {
        Silo silo = siloRepository.findById(delivery.getSilo().getId()).orElseThrow();
        silo.setCurrentLevel(silo.getCurrentLevel() + delivery.getQuantity());
        siloRepository.save(silo);
        deliveryRepository.save(delivery);
    }

    @Transactional
    public void consumeFeed(Long siloId, Double quantity) {
        Silo silo = siloRepository.findById(siloId).orElseThrow();
        silo.setCurrentLevel(Math.max(0, silo.getCurrentLevel() - quantity));
        
        // Alert if level < 20% capacity
        if (silo.getCurrentLevel() < (silo.getCapacity() * 0.2)) {
            notificationService.createRoleNotification(
                "Low Silo Alert",
                "Silo " + silo.getName() + " is below 20% capacity (" + silo.getCurrentLevel().intValue() + " kg remaining).",
                Role.FARM_MANAGER
            );
        }
        siloRepository.save(silo);
    }
}
