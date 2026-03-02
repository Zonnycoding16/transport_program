package com.logistics.service;

import com.logistics.entity.Connection;
import com.logistics.repository.ConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CostCalculator {

    @Autowired
    private ConnectionRepository connectionRepository;

    // Lấy khoảng cách từ Database
    public double getDistance(Long fromId, Long toId) {
        Optional<Connection> connection = connectionRepository.findByFromLocationIdAndToLocationId(fromId, toId);
        
        if (connection.isPresent()) {
            return connection.get().getDistanceKm();
        }
        return 0.0; // Không tìm thấy đường
    }

    // Tính tiền dựa trên giá vé lưu trong Database
    public double calculateShippingCost(Long fromId, Long toId) {
        Optional<Connection> connection = connectionRepository.findByFromLocationIdAndToLocationId(fromId, toId);

        if (connection.isPresent()) {
            return connection.get().getPrice(); 
        }
        return 0.0;
    }
}