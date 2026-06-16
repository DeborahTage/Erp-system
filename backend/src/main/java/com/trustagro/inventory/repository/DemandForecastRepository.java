package com.trustagro.inventory.repository;

import com.trustagro.inventory.entity.DemandForecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandForecastRepository extends JpaRepository<DemandForecast, Long> {
    List<DemandForecast> findByItemIdOrderByForecastDateDesc(Long itemId);
}
