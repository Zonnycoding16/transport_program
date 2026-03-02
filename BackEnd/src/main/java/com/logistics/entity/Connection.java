package com.logistics.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "connections")
public class Connection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // QUAN TRỌNG: Tên biến phải đúng y hệt như thế này
    private Double distanceKm; // Khoảng cách (km)
    private Double price;      // Giá tiền (VNĐ)
    private String transportType; // Loại xe (ROAD, SEA, AIR)

    @ManyToOne
    @JoinColumn(name = "from_location_id")
    private Location fromLocation;

    @ManyToOne
    @JoinColumn(name = "to_location_id")
    private Location toLocation;
}