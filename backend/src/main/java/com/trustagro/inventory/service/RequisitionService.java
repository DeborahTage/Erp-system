package com.trustagro.inventory.service;

import com.trustagro.farm.repository.BarnRepository;
import com.trustagro.farm.repository.FarmRepository;
import com.trustagro.farm.repository.FlockRepository;
import com.trustagro.inventory.entity.InternalRequisition;
import com.trustagro.inventory.entity.RequisitionItem;
import com.trustagro.inventory.entity.RequisitionStatus;
import com.trustagro.inventory.repository.InternalRequisitionRepository;
import com.trustagro.inventory.repository.InventoryItemRepository;
import com.trustagro.user.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class RequisitionService {

    private final InternalRequisitionRepository requisitionRepository;
    private final InventoryItemRepository itemRepository;
    private final FarmRepository farmRepository;
    private final BarnRepository barnRepository;
    private final FlockRepository flockRepository;
    private final InventoryService inventoryService;

    public RequisitionService(InternalRequisitionRepository requisitionRepository,
                              InventoryItemRepository itemRepository,
                              FarmRepository farmRepository,
                              BarnRepository barnRepository,
                              FlockRepository flockRepository,
                              InventoryService inventoryService) {
        this.requisitionRepository = requisitionRepository;
        this.itemRepository = itemRepository;
        this.farmRepository = farmRepository;
        this.barnRepository = barnRepository;
        this.flockRepository = flockRepository;
        this.inventoryService = inventoryService;
    }

    public List<InternalRequisition> getAllRequisitions() {
        return requisitionRepository.findAll();
    }

    @Transactional
    public InternalRequisition createRequisition(Map<String, Object> data, User user) {
        InternalRequisition req = new InternalRequisition();
        req.setRequisitionNumber("REQ-" + System.currentTimeMillis());
        
        if (data.containsKey("farmId")) req.setFarm(farmRepository.findById(Long.valueOf(data.get("farmId").toString())).orElse(null));
        if (data.containsKey("barnId")) req.setBarn(barnRepository.findById(Long.valueOf(data.get("barnId").toString())).orElse(null));
        if (data.containsKey("flockId")) req.setFlock(flockRepository.findById(Long.valueOf(data.get("flockId").toString())).orElse(null));
        
        req.setNotes(data.getOrDefault("notes", "").toString());
        req.setRequestedBy(user);
        req.setStatus(RequisitionStatus.REQUESTED);

        List<Map<String, Object>> items = (List<Map<String, Object>>) data.get("items");
        
        BigDecimal totalValue = BigDecimal.ZERO;
        
        for (Map<String, Object> itemData : items) {
            RequisitionItem ri = new RequisitionItem();
            ri.setRequisition(req);
            ri.setItem(itemRepository.findById(Long.valueOf(itemData.get("itemId").toString())).orElseThrow());
            ri.setQuantityRequested(Double.valueOf(itemData.get("quantity").toString()));
            
            // Expected current cost
            ri.setUnitCost(ri.getItem().getAvgUnitCost());
            if (ri.getUnitCost() != null) {
                ri.setTotalCost(ri.getUnitCost().multiply(BigDecimal.valueOf(ri.getQuantityRequested())));
                totalValue = totalValue.add(ri.getTotalCost());
            }
            req.getItems().add(ri);
        }
        
        req.setTotalValue(totalValue);
        
        return requisitionRepository.save(req);
    }

    @Transactional
    public InternalRequisition approveRequisition(Long reqId, User user) {
        InternalRequisition req = requisitionRepository.findById(reqId).orElseThrow();
        req.setStatus(RequisitionStatus.APPROVED);
        req.setApprovedBy(user);
        req.setApprovedAt(LocalDateTime.now());
        
        // For simplicity, approve requested quantity fully. Can be expanded for partial.
        req.getItems().forEach(i -> i.setQuantityApproved(i.getQuantityRequested()));
        
        return requisitionRepository.save(req);
    }

    @Transactional
    public InternalRequisition issueRequisition(Long reqId, User user) {
        InternalRequisition req = requisitionRepository.findById(reqId).orElseThrow();
        if (req.getStatus() != RequisitionStatus.APPROVED) {
            throw new IllegalStateException("Requisition must be APPROVED before issuing");
        }
        
        req.setStatus(RequisitionStatus.ISSUED);
        req.setIssuedBy(user);
        req.setIssuedAt(LocalDateTime.now());

        for (RequisitionItem ri : req.getItems()) {
            ri.setQuantityIssued(ri.getQuantityApproved());
            // Call InventoryService to physically deduct stock
            inventoryService.stockOut(ri.getItem().getId(), ri.getQuantityIssued(), "ISSUE", req.getId(), user);
        }

        return requisitionRepository.save(req);
    }
}
