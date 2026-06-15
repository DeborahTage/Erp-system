package com.trustagro.farm.repository;

import com.trustagro.farm.entity.Barn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BarnRepository extends JpaRepository<Barn, Long> {
    List<Barn> findByFarmId(Long farmId);
}
