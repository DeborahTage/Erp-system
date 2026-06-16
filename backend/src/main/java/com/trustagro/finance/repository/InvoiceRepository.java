package com.trustagro.finance.repository;

import com.trustagro.finance.entity.Invoice;
import com.trustagro.finance.entity.InvoiceStatus;
import com.trustagro.finance.entity.InvoiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    List<Invoice> findByStatus(InvoiceStatus status);
    List<Invoice> findByClientId(Long clientId);
    List<Invoice> findByInvoiceType(InvoiceType type);
    List<Invoice> findByDueDateBeforeAndStatusNot(LocalDate date, InvoiceStatus status);
}
