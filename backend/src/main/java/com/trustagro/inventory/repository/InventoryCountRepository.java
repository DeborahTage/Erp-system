package com.trustagro.inventory.repository;

import com.trustagro.inventory.entity.InventoryCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryCountRepository extends JpaRepository<InventoryCount, Long> {
    List<InventoryCount> findByItemId(Long itemId);
}
