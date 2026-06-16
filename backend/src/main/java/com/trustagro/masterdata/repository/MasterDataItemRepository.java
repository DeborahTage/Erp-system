package com.trustagro.masterdata.repository;

import com.trustagro.masterdata.entity.MasterDataCategory;
import com.trustagro.masterdata.entity.MasterDataItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MasterDataItemRepository extends JpaRepository<MasterDataItem, Long> {
    List<MasterDataItem> findByCategoryOrderBySortOrderAscValueAsc(MasterDataCategory category);
    List<MasterDataItem> findByCategoryAndActiveTrueOrderBySortOrderAscValueAsc(MasterDataCategory category);
    boolean existsByCategoryAndValue(MasterDataCategory category, String value);
}
