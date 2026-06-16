package com.trustagro.inventory.service;

import com.trustagro.common.exception.ResourceNotFoundException;
import com.trustagro.inventory.entity.Supplier;
import com.trustagro.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    public Supplier getById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
    }

    public Supplier create(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier update(Long id, Supplier req) {
        Supplier s = getById(id);
        s.setName(req.getName());
        s.setContactPerson(req.getContactPerson());
        s.setEmail(req.getEmail());
        s.setPhone(req.getPhone());
        s.setAddress(req.getAddress());
        s.setCategory(req.getCategory());
        s.setPaymentTerms(req.getPaymentTerms());
        s.setRating(req.getRating());
        return supplierRepository.save(s);
    }

    public void delete(Long id) {
        supplierRepository.deleteById(id);
    }
}
