package com.logistics.repository;

import com.logistics.entity.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, Long> {
    // JpaRepository đã có sẵn hàm findAll(), save(), findById()...
    // Bạn không cần viết gì thêm ở đây cả.
}