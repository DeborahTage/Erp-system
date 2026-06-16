package com.trustagro.finance.repository;

import com.trustagro.finance.entity.CustomerWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerWalletRepository extends JpaRepository<CustomerWallet, Long> {
    Optional<CustomerWallet> findByClientId(Long clientId);
}
