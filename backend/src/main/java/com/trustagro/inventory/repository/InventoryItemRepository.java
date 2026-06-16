package com.trustagro.inventory.repository;

import com.trustagro.inventory.entity.InventoryItem;
import com.trustagro.inventory.entity.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByStatus(ItemStatus status);
    Optional<InventoryItem> findByBarcodeOrRfidTag(String barcode, String rfidTag);
    Optional<InventoryItem> findBySku(String sku);
}
