package com.trustagro.finance.controller;

import com.trustagro.common.response.ApiResponse;
import com.trustagro.finance.entity.Invoice;
import com.trustagro.finance.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/finance/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/pos")
    @PreAuthorize("hasAnyRole('ADMIN','FINANCE_OFFICER', 'PHARMACY_MANAGER', 'STORE_KEEPER')")
    public ResponseEntity<ApiResponse<Invoice>> createPOS(@RequestBody Map<String, Object> req) {
        Invoice invoice = invoiceService.createPOSInvoice(
                Long.valueOf(req.get("clientId").toString()),
                req.get("clientName").toString(),
                com.trustagro.finance.entity.BusinessUnit.valueOf(req.get("unit").toString()),
                new BigDecimal(req.get("subtotal").toString()),
                new BigDecimal(req.get("vatAmount").toString())
        );
        return ResponseEntity.ok(ApiResponse.success("POS Invoice created", invoice));
    }

    @PostMapping("/service")
    @PreAuthorize("hasAnyRole('ADMIN','FINANCE_OFFICER', 'GENERAL_MANAGER')")
    public ResponseEntity<ApiResponse<Invoice>> createService(@RequestBody Map<String, Object> req) {
        Invoice invoice = invoiceService.createServiceInvoice(
                Long.valueOf(req.get("clientId").toString()),
                req.get("clientName").toString(),
                com.trustagro.finance.entity.BusinessUnit.valueOf(req.get("unit").toString()),
                new BigDecimal(req.get("amount").toString()),
                LocalDate.parse(req.get("dueDate").toString())
        );
        return ResponseEntity.ok(ApiResponse.success("Service Invoice created", invoice));
    }
}
