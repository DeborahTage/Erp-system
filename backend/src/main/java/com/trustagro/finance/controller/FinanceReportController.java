package com.trustagro.finance.controller;

import com.trustagro.common.response.ApiResponse;
import com.trustagro.finance.entity.BusinessUnit;
import com.trustagro.finance.service.FinanceReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

import com.trustagro.finance.dto.ProfitLossDTO;

@RestController
@RequestMapping("/api/finance/reports")
@RequiredArgsConstructor
public class FinanceReportController {

    private final FinanceReportService reportService;

    @GetMapping("/profit-loss")
    @PreAuthorize("hasAnyRole('ADMIN','GENERAL_MANAGER','FINANCE_OFFICER')")
    public ResponseEntity<ApiResponse<ProfitLossDTO>> getProfitLoss(
            @RequestParam(required = false) BusinessUnit unit,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.success(reportService.getProfitAndLoss(unit, from, to)));
    }

    @GetMapping("/ar-aging")
    @PreAuthorize("hasAnyRole('ADMIN','GENERAL_MANAGER','FINANCE_OFFICER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getARAging() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getARAgingReport()));
    }
}
