package com.trustagro.masterdata.dto;

import com.trustagro.masterdata.entity.MasterDataCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MasterDataRequest {
    @NotNull(message = "Category is required")
    private MasterDataCategory category;

    @NotBlank(message = "Value is required")
    private String value;

    @NotBlank(message = "Label is required")
    private String label;

    private String description;
    
    private Integer sortOrder = 0;
    
    private boolean active = true;

    public MasterDataCategory getCategory() { return category; }
    public String getValue() { return value; }
    public String getLabel() { return label; }
    public String getDescription() { return description; }
    public Integer getSortOrder() { return sortOrder; }
    public boolean isActive() { return active; }
}
