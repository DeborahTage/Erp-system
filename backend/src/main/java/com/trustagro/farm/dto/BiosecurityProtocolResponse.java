package com.trustagro.farm.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BiosecurityProtocolResponse {
    private Long id;
    private Long farmId;
    private String farmName;
    
    private boolean footbathRefreshed;
    private boolean vehicularSpray;
    private boolean ppeWorn;
    private boolean visitorLogged;
    
    private String vehicleReg;
    private String visitorName;
    private String notes;
    private String staffSignature;
    private LocalDateTime timestamp;

    public void setId(Long id) { this.id = id; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }
    public void setFarmName(String farmName) { this.farmName = farmName; }
    public void setFootbathRefreshed(boolean footbathRefreshed) { this.footbathRefreshed = footbathRefreshed; }
    public void setVehicularSpray(boolean vehicularSpray) { this.vehicularSpray = vehicularSpray; }
    public void setPpeWorn(boolean ppeWorn) { this.ppeWorn = ppeWorn; }
    public void setVisitorLogged(boolean visitorLogged) { this.visitorLogged = visitorLogged; }
    public void setVehicleReg(String vehicleReg) { this.vehicleReg = vehicleReg; }
    public void setVisitorName(String visitorName) { this.visitorName = visitorName; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setStaffSignature(String staffSignature) { this.staffSignature = staffSignature; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
