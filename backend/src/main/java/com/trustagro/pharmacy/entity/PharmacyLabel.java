package com.trustagro.pharmacy.entity;

import com.trustagro.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "pharmacy_labels")
@Data
public class PharmacyLabel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_item_id")
    private PrescriptionItem prescriptionItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id")
    private PharmacySale sale;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String labelContent;

    private LocalDateTime printedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "printed_by")
    private User printedBy;

    public void setPrescriptionItem(PrescriptionItem prescriptionItem) { this.prescriptionItem = prescriptionItem; }
    public void setLabelContent(String labelContent) { this.labelContent = labelContent; }
    public void setPrintedBy(User printedBy) { this.printedBy = printedBy; }
    public void setPrintedAt(LocalDateTime printedAt) { this.printedAt = printedAt; }
}
