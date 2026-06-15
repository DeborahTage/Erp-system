package com.trustagro.farm.repository;

import com.trustagro.farm.entity.BiosecurityProtocol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BiosecurityProtocolRepository extends JpaRepository<BiosecurityProtocol, Long> {
    List<BiosecurityProtocol> findByFarmIdOrderByTimestampDesc(Long farmId);
}
