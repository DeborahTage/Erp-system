package com.trustagro.veterinary.entity;

import com.trustagro.farm.entity.Farm;
import com.trustagro.farm.entity.Flock;
import com.trustagro.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "biosecurity_logs")
@Data
public class BiosecurityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id")
    private Farm farm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flock_id")
    private Flock flock;

    private String barnId;

    private boolean footbathCompleted;
    private boolean vehicleSprayCompleted;
    private boolean visitorLogCompleted;
    private boolean ppeCheckCompleted;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String staffSignature;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "logged_by")
    private User loggedBy;

    private LocalDateTime visitTimestamp;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
