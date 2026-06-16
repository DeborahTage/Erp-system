package com.trustagro.pharmacy.repository;

import com.trustagro.pharmacy.entity.PharmacyCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PharmacyCustomerRepository extends JpaRepository<PharmacyCustomer, Long> {
    Optional<PharmacyCustomer> findByphone(String phone);
    List<PharmacyCustomer> findByIsActiveTrue();
    List<PharmacyCustomer> findByNameContainingIgnoreCase(String name);
}
