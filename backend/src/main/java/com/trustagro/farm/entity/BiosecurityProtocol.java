package com.trustagro.farm.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "biosecurity_protocols")
@Data
@EntityListeners(AuditingEntityListener.class)
public class BiosecurityProtocol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    private boolean footbathRefreshed;
    private boolean vehicularSpray;
    private boolean ppeWorn;
    private boolean visitorLogged;

    private String vehicleReg;
    private String visitorName;
    private String notes;
    private String staffSignature;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime timestamp;

    public Farm getFarm() { return farm; }
    public boolean isFootbathRefreshed() { return footbathRefreshed; }
    public boolean isVehicularSpray() { return vehicularSpray; }
    public boolean isPpeWorn() { return ppeWorn; }
    public boolean isVisitorLogged() { return visitorLogged; }
    public String getVehicleReg() { return vehicleReg; }
    public String getVisitorName() { return visitorName; }
    public String getNotes() { return notes; }
    public String getStaffSignature() { return staffSignature; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public Long getId() { return id; }

    public void setFarm(Farm farm) { this.farm = farm; }
    public void setFootbathRefreshed(boolean footbathRefreshed) { this.footbathRefreshed = footbathRefreshed; }
    public void setVehicularSpray(boolean vehicularSpray) { this.vehicularSpray = vehicularSpray; }
    public void setPpeWorn(boolean ppeWorn) { this.ppeWorn = ppeWorn; }
    public void setVisitorLogged(boolean visitorLogged) { this.visitorLogged = visitorLogged; }
    public void setVehicleReg(String vehicleReg) { this.vehicleReg = vehicleReg; }
    public void setVisitorName(String visitorName) { this.visitorName = visitorName; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setStaffSignature(String staffSignature) { this.staffSignature = staffSignature; }
}
