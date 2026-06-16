package com.trustagro.farm.service;

import com.trustagro.farm.entity.Barn;
import com.trustagro.farm.repository.BarnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BarnService {

    private final BarnRepository barnRepository;

    public List<Barn> getAllBarns() {
        return barnRepository.findAll();
    }

    public List<Barn> getBarnsByFarm(Long farmId) {
        return barnRepository.findByFarmId(farmId);
    }

    public Barn createBarn(Barn barn) {
        return barnRepository.save(barn);
    }

    public Barn updateBarn(Long id, Barn barnDetails) {
        Barn barn = barnRepository.findById(id).orElseThrow();
        barn.setName(barnDetails.getName());
        barn.setCapacity(barnDetails.getCapacity());
        barn.setBarnType(barnDetails.getBarnType());
        barn.setStatus(barnDetails.getStatus());
        return barnRepository.save(barn);
    }
}
