package com.logistics.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "connections")
public class Connection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "from_location_id")
    private Location fromLocation; // Điểm bắt đầu

    @ManyToOne
    @JoinColumn(name = "to_location_id")
    private Location toLocation; // Điểm kết thúc

    private Double distance; // Khoảng cách (km) - Đây là trọng số để Dijkstra tính toán

    private String transportType; // Loại hình (DUONG_BO, DUONG_SAT, DUONG_THUY)
}