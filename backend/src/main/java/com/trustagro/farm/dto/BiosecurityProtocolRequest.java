package com.trustagro.farm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BiosecurityProtocolRequest {
    @NotNull private Long farmId;
    
    private boolean footbathRefreshed;
    private boolean vehicularSpray;
    private boolean ppeWorn;
    private boolean visitorLogged;
    
    private String vehicleReg;
    private String visitorName;
    private String notes;
    @NotBlank private String staffSignature;
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public Long getFarmId() { return farmId; }
    public boolean isFootbathRefreshed() { return footbathRefreshed; }
    public boolean isVehicularSpray() { return vehicularSpray; }
    public boolean isPpeWorn() { return ppeWorn; }
    public boolean isVisitorLogged() { return visitorLogged; }
    public String getVehicleReg() { return vehicleReg; }
    public String getVisitorName() { return visitorName; }
    public String getNotes() { return notes; }
    public String getStaffSignature() { return staffSignature; }
}
