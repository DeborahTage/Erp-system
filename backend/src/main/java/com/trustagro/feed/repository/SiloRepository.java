package com.trustagro.feed.repository;

import com.trustagro.feed.entity.Silo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiloRepository extends JpaRepository<Silo, Long> {
    List<Silo> findByBarnId(Long barnId);
}
