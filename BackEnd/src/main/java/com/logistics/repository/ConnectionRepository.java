package com.logistics.repository;

import com.logistics.entity.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    // Tìm kết nối giữa 2 điểm (từ A -> B)
    Optional<Connection> findByFromLocationIdAndToLocationId(Long fromId, Long toId);
}