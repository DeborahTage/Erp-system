package com.trustagro.finance.controller;

import com.trustagro.common.response.ApiResponse;
import com.trustagro.finance.entity.FinanceTransaction;
import com.trustagro.finance.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN','GENERAL_MANAGER','FINANCE_OFFICER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(financeService.getDashboardSummary()));
    }

    @GetMapping("/transactions")
    @PreAuthorize("hasAnyRole('ADMIN','GENERAL_MANAGER','FINANCE_OFFICER')")
    public ResponseEntity<ApiResponse<List<FinanceTransaction>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(financeService.getAllTransactions()));
    }
}
