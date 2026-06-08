package com.trustagro.pharmacy.dto;

import com.trustagro.pharmacy.entity.CustomerType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerRequest {
    @NotBlank @Size(max = 120) private String customerName;
    @Pattern(regexp = "^(\\+?[0-9 .()-]{7,20})?$", message = "Phone number format is invalid")
    private String phone;
    @Size(max = 180)
    private String location;
    private CustomerType customerType;
}
