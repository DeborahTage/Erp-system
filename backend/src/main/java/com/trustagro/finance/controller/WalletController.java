package com.trustagro.finance.controller;

import com.trustagro.common.response.ApiResponse;
import com.trustagro.finance.entity.CustomerWallet;
import com.trustagro.finance.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/finance/wallets")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @PostMapping("/deposit")
    @PreAuthorize("hasAnyRole('ADMIN','FINANCE_OFFICER', 'CASHIER')")
    public ResponseEntity<ApiResponse<CustomerWallet>> deposit(@RequestBody Map<String, Object> req) {
        CustomerWallet wallet = walletService.deposit(
                Long.valueOf(req.get("clientId").toString()),
                req.get("clientName").toString(),
                new BigDecimal(req.get("amount").toString())
        );
        return ResponseEntity.ok(ApiResponse.success("Deposit successful", wallet));
    }
}
