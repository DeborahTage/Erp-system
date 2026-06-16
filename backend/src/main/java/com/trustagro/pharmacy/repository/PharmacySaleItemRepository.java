package com.trustagro.pharmacy.repository;

import com.trustagro.pharmacy.entity.PharmacySaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PharmacySaleItemRepository extends JpaRepository<PharmacySaleItem, Long> {
    List<PharmacySaleItem> findBySaleId(Long saleId);
    List<PharmacySaleItem> findByBatchNumber(String batchNumber);
    List<PharmacySaleItem> findByInventoryItemId(Long itemId);
}
