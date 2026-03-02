package com.logistics.entity;

import jakarta.persistence.*;
import lombok.Data; // Cái này giúp tự tạo Getter/Setter
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "province") // Tên bảng trong Database
public class Province {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name; // Tên tỉnh (VD: Hà Nội)

    @Column(name = "code", unique = true)
    private String code; // Mã vùng (VD: V01)

    private String description; // Mô tả thêm
}