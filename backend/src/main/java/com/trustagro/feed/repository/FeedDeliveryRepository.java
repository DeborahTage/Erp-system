package com.trustagro.feed.repository;

import com.trustagro.feed.entity.FeedDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedDeliveryRepository extends JpaRepository<FeedDelivery, Long> {
    List<FeedDelivery> findBySiloIdOrderByDeliveryDateDesc(Long siloId);
}
