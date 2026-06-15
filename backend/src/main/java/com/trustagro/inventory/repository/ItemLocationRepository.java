package com.trustagro.inventory.repository;

import com.trustagro.inventory.entity.ItemLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemLocationRepository extends JpaRepository<ItemLocation, Long> {
    List<ItemLocation> findByItemId(Long itemId);
    Optional<ItemLocation> findByItemIdAndLocationId(Long itemId, Long locationId);
}
