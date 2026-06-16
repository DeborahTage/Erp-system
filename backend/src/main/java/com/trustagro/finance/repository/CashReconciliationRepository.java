package com.trustagro.finance.repository;

import com.trustagro.finance.entity.CashReconciliation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface CashReconciliationRepository extends JpaRepository<CashReconciliation, Long> {
    Optional<CashReconciliation> findByReconciliationDate(LocalDate date);
}
