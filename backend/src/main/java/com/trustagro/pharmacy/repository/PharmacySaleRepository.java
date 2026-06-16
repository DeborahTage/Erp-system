package com.trustagro.pharmacy.repository;

import com.trustagro.pharmacy.entity.PharmacySale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PharmacySaleRepository extends JpaRepository<PharmacySale, Long> {
    
    @Query("SELECT s FROM PharmacySale s WHERE s.createdAt >= :startDate AND s.createdAt <= :endDate")
    List<PharmacySale> findSalesBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
}
