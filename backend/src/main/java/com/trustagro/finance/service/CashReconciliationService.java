package com.trustagro.finance.service;

import com.trustagro.finance.entity.CashReconciliation;
import com.trustagro.finance.repository.CashReconciliationRepository;
import com.trustagro.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class CashReconciliationService {

    private final CashReconciliationRepository repository;
    private final UserRepository userRepository;

    public CashReconciliation reconcile(BigDecimal expected, BigDecimal actual, String notes) {
        CashReconciliation r = new CashReconciliation();
        r.setReconciliationDate(LocalDate.now());
        r.setExpectedCash(expected);
        r.setActualCash(actual);
        
        BigDecimal variance = actual.subtract(expected);
        r.setVariance(variance);
        
        if (variance.compareTo(BigDecimal.ZERO) == 0) r.setStatus("BALANCED");
        else if (variance.compareTo(BigDecimal.ZERO) < 0) r.setStatus("SHORT");
        else r.setStatus("OVER");

        r.setNotes(notes);
        
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByEmail(email).ifPresent(r::setClosedBy);
        
        return repository.save(r);
    }
}
