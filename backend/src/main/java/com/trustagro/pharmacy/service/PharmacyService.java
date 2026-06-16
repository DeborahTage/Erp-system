package com.trustagro.pharmacy.service;

import com.trustagro.farm.entity.Flock;
import com.trustagro.finance.entity.FinanceTransaction;
import com.trustagro.finance.entity.TransactionType;
import com.trustagro.finance.repository.FinanceTransactionRepository;
import com.trustagro.inventory.entity.InventoryItem;
import com.trustagro.inventory.entity.MovementType;
import com.trustagro.inventory.entity.StockBatch;
import com.trustagro.inventory.entity.StockMovement;
import com.trustagro.inventory.repository.InventoryItemRepository;
import com.trustagro.inventory.repository.StockBatchRepository;
import com.trustagro.inventory.repository.StockMovementRepository;
import com.trustagro.pharmacy.dto.PosSaleRequest;
import com.trustagro.pharmacy.dto.SaleItemDto;
import com.trustagro.pharmacy.entity.*;
import com.trustagro.pharmacy.repository.*;
import com.trustagro.user.entity.User;
import com.trustagro.veterinary.entity.Prescription;
import com.trustagro.veterinary.repository.PrescriptionRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.trustagro.inventory.service.InventoryService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PharmacyService {

    private static final Logger log = LoggerFactory.getLogger(PharmacyService.class);

    private final PharmacyPatientRepository patientRepository;
    private final PharmacyPrescriptionRepository rxRepository;
    private final PrescriptionItemRepository rxItemRepository;
    private final PharmacySaleRepository saleRepository;
    private final DurAlertRepository durAlertRepository;
    private final PharmacyLabelRepository labelRepository;
    private final PharmacyCustomerRepository customerRepository;
    private final PharmacySaleItemRepository saleItemRepository;
    
    private final PrescriptionRepository vetRxRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final StockBatchRepository stockBatchRepository;
    private final StockMovementRepository stockMovementRepository;
    private final FinanceTransactionRepository financeTransactionRepository;
    private final InventoryService inventoryService;

    public PharmacyService(PharmacyPatientRepository patientRepository,
                           PharmacyPrescriptionRepository rxRepository,
                           PrescriptionItemRepository rxItemRepository,
                           PharmacySaleRepository saleRepository,
                           DurAlertRepository durAlertRepository,
                           PharmacyLabelRepository labelRepository,
                           PharmacyCustomerRepository customerRepository,
                           PharmacySaleItemRepository saleItemRepository,
                           PrescriptionRepository vetRxRepository,
                           InventoryItemRepository inventoryItemRepository,
                           StockBatchRepository stockBatchRepository,
                           StockMovementRepository stockMovementRepository,
                           FinanceTransactionRepository financeTransactionRepository,
                           InventoryService inventoryService) {
        this.patientRepository = patientRepository;
        this.rxRepository = rxRepository;
        this.rxItemRepository = rxItemRepository;
        this.saleRepository = saleRepository;
        this.durAlertRepository = durAlertRepository;
        this.labelRepository = labelRepository;
        this.customerRepository = customerRepository;
        this.saleItemRepository = saleItemRepository;
        this.vetRxRepository = vetRxRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.stockBatchRepository = stockBatchRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.financeTransactionRepository = financeTransactionRepository;
        this.inventoryService = inventoryService;
    }

    @Transactional
    public PharmacyPrescription receivePrescription(Long vetPrescriptionId, User pharmacyUser) {
        Prescription vetRx = vetRxRepository.findById(vetPrescriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Vet Prescription not found"));

        PharmacyPatient patient = patientRepository.findByFlockId(vetRx.getFlockId())
                .orElseGet(() -> {
                    PharmacyPatient newPatient = new PharmacyPatient();
                    newPatient.setPatientName("Flock-" + vetRx.getFlockId());
                    newPatient.setSpecies("Chicken");
                    return patientRepository.save(newPatient);
                });

        PharmacyPrescription rx = new PharmacyPrescription();
        rx.setPrescriptionCode("RX-" + System.currentTimeMillis());
        rx.setVetPrescription(vetRx);
        rx.setPatient(patient);
        rx.setPrescribedBy(vetRx.getCreatedByVet() != null ? vetRx.getCreatedByVet() : pharmacyUser);
        rx.setDiagnosis("Transferred from Vet Module");
        rx.setStatus("Pending");

        rx = rxRepository.save(rx);
        
        if (vetRx.getInventoryItemId() != null) {
            InventoryItem drug = inventoryItemRepository.findById(vetRx.getInventoryItemId()).orElse(null);
            if (drug != null) {
                PrescriptionItem rxItem = new PrescriptionItem();
                rxItem.setPrescription(rx);
                rxItem.setInventoryItem(drug);
                rxItem.setDosage(vetRx.getDosageInstruction());
                rxItem.setFrequency(vetRx.getFrequency());
                rxItem.setDurationDays(vetRx.getDurationDays());
                rxItem.setQuantityPrescribed(BigDecimal.valueOf(vetRx.getQuantity() != null ? vetRx.getQuantity() : 1.0));
                rxItemRepository.save(rxItem);
            }
        }

        runDUR(rx.getId(), patient.getId());
        return rx;
    }

    @Transactional
    public void runDUR(Long pharmacyRxId, Long patientId) {
        PharmacyPrescription rx = rxRepository.findById(pharmacyRxId).orElseThrow();
        List<PrescriptionItem> items = rxItemRepository.findByPrescriptionId(pharmacyRxId);
        List<Object> warnings = new ArrayList<>();
        
        for (PrescriptionItem item : items) {
            InventoryItem drug = item.getInventoryItem();
            List<StockBatch> batches = stockBatchRepository.findAvailableBatchesFEFO(drug.getId(), LocalDate.now());
            if (batches.isEmpty()) {
                DurAlert alert = new DurAlert();
                alert.setPrescription(rx);
                alert.setAlertType("OUT_OF_STOCK");
                alert.setSeverity("Critical");
                alert.setMessage(drug.getItemName() + " is out of stock");
                durAlertRepository.save(alert);
                warnings.add(Map.of("type", "OUT_OF_STOCK", "severity", "Critical", "message", alert.getMessage()));
            }
        }
        rx.setDurWarnings(warnings);
        rxRepository.save(rx);
    }

    @Transactional
    public PharmacySale processSale(PosSaleRequest request, User user) {
        PharmacySale sale = new PharmacySale();
        sale.setSaleCode("SAL-" + System.currentTimeMillis());
        sale.setSoldBy(user);
        sale.setPaymentMethod(request.getPaymentMethod());
        sale.setCustomerName(request.getCustomerName());
        sale.setCustomerPhone(request.getCustomerPhone());

        PharmacyCustomer customer = null;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId()).orElse(null);
            if (customer != null) {
                sale.setCustomer(customer);
                sale.setCustomerName(customer.getName());
                sale.setCustomerPhone(customer.getPhone());
                
                // Set Price Type based on Customer Type
                if (customer.getCustomerType() == CustomerType.WHOLESALE) sale.setPriceType(PriceType.WHOLESALE);
                else if (customer.getCustomerType() == CustomerType.PARTNER_FARM) sale.setPriceType(PriceType.PARTNER);
                else sale.setPriceType(PriceType.RETAIL);
            }
        }

        if (request.getPrescriptionId() != null) {
            PharmacyPrescription rx = rxRepository.findById(request.getPrescriptionId()).orElse(null);
            if (rx != null) {
                sale.setPrescription(rx);
                sale.setPatient(rx.getPatient());
                rx.setStatus("Dispensed");
                rx.setProcessedBy(user);
                rxRepository.save(rx);
            }
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<PharmacySaleItem> saleItems = new ArrayList<>();

        for (SaleItemDto itemDto : request.getItems()) {
            InventoryItem item = inventoryItemRepository.findById(itemDto.getItemId()).orElseThrow();
            
            // PRESCRIPTION GUARD
            if (Boolean.TRUE.equals(item.getIsControlled()) && sale.getPrescription() == null) {
                throw new IllegalStateException("Sale blocked: " + item.getItemName() + " requires a prescription.");
            }

            // Deduct Stock
            Map<String, Object> outResult = inventoryService.stockOut(
                itemDto.getItemId(), 
                itemDto.getQty().doubleValue(), 
                "PHARMACY_SALE", 
                null, 
                user
            );

            // Tiered Pricing logic
            BigDecimal unitPrice = item.getRetailPrice();
            if (sale.getPriceType() == PriceType.WHOLESALE && item.getWholesalePrice() != null) {
                unitPrice = item.getWholesalePrice();
            } else if (sale.getPriceType() == PriceType.PARTNER && item.getPartnerPrice() != null) {
                unitPrice = item.getPartnerPrice();
            }

            BigDecimal lineTotal = unitPrice.multiply(itemDto.getQty());
            subtotal = subtotal.add(lineTotal);

            PharmacySaleItem si = new PharmacySaleItem();
            si.setSale(sale);
            si.setInventoryItem(item);
            si.setItemName(item.getItemName());
            si.setQuantity(itemDto.getQty());
            si.setUnitPrice(unitPrice);
            si.setLineTotal(lineTotal);
            si.setPriceType(sale.getPriceType());
            
            // Traceability: attach first batch used if available from inventory result
            if (outResult.containsKey("batchNumber")) {
                si.setBatchNumber((String) outResult.get("batchNumber"));
            }

            saleItems.add(si);
        }

        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.15));
        BigDecimal total = subtotal.add(tax);

        sale.setSaleItems(saleItems);
        sale.setSubtotal(subtotal);
        sale.setTaxAmount(tax);
        sale.setTotalAmount(total);

        // Handle Credit Payment
        if ("CREDIT".equalsIgnoreCase(request.getPaymentMethod()) && customer != null) {
            BigDecimal newBalance = customer.getOutstandingBalance().add(total);
            if (customer.getCreditLimit() != null && newBalance.compareTo(customer.getCreditLimit()) > 0) {
                throw new IllegalStateException("Credit limit exceeded for customer: " + customer.getName());
            }
            customer.setOutstandingBalance(newBalance);
            customerRepository.save(customer);
            sale.setPaymentStatus(PaymentStatus.CREDIT);
        }

        PharmacySale savedSale = saleRepository.save(sale);

        // Revenue Log
        FinanceTransaction ft = new FinanceTransaction();
        ft.setTransactionType(TransactionType.INCOME);
        ft.setAmount(total);
        ft.setCategory("Pharmacy Revenue");
        ft.setDescription("Sale: " + savedSale.getSaleCode());
        ft.setRecordedBy(user);
        ft.setTransactionDate(LocalDate.now());
        financeTransactionRepository.save(ft);

        return savedSale;
    }

    public Map<String, Object> getDashboardStats() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDateTime.now();
        
        List<PharmacySale> todaySales = saleRepository.findSalesBetweenDates(startOfDay, endOfDay);
        BigDecimal revenueToday = todaySales.stream()
                .map(PharmacySale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long pendingRx = rxRepository.countByStatus("Pending");
        
        // Mocking trend data for frontend charts
        List<Map<String, Object>> trend = List.of(
            Map.of("day", "Mon", "sales", 1200),
            Map.of("day", "Tue", "sales", 1500),
            Map.of("day", "Wed", "sales", 1100),
            Map.of("day", "Thu", "sales", 1800),
            Map.of("day", "Fri", "sales", revenueToday)
        );

        Map<String, Object> stats = new HashMap<>();
        stats.put("revenue_today", revenueToday);
        stats.put("sales_count_today", todaySales.size());
        stats.put("pending_prescriptions", pendingRx);
        stats.put("revenue_trend", trend);
        
        return stats;
    }

    @Transactional
    public PharmacyCustomer saveCustomer(PharmacyCustomer customer) {
        if (customer.getCustomerCode() == null) {
            customer.setCustomerCode("CUST-" + System.currentTimeMillis());
        }
        return customerRepository.save(customer);
    }

    public List<PharmacyCustomer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Transactional
    public PharmacyLabel generateLabel(Long rxItemId, User user) {
        PrescriptionItem item = rxItemRepository.findById(rxItemId).orElseThrow();
        String content = "TRUST AGRO VETERINARY PHARMACY\n" +
                "Drug: " + item.getInventoryItem().getItemName() + "\n" +
                "Qty: " + item.getQuantityPrescribed() + "\n" +
                "Date: " + LocalDate.now();
                
        PharmacyLabel label = new PharmacyLabel();
        label.setPrescriptionItem(item);
        label.setLabelContent(content);
        label.setPrintedBy(user);
        label.setPrintedAt(LocalDateTime.now());
        return labelRepository.save(label);
    }
}
