package com.logistics.controller;

import com.logistics.entity.Province;
import com.logistics.repository.ProvinceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provinces")
@CrossOrigin(origins = "*") // Cho phép mọi nơi truy cập (Frontend, Postman...)
public class ProvinceController {

    @Autowired
    private ProvinceRepository provinceRepository;

    // 1. API Lấy danh sách toàn bộ 34 Vùng
    // URL: http://localhost:8081/api/provinces
    @GetMapping
    public List<Province> getAllProvinces() {
        return provinceRepository.findAll();
    }

    // 2. API Lấy chi tiết 1 Vùng theo ID
    // URL: http://localhost:8081/api/provinces/1
    @GetMapping("/{id}")
    public ResponseEntity<Province> getProvinceById(@PathVariable Long id) {
        return provinceRepository.findById(id)
                .map(province -> ResponseEntity.ok().body(province))
                .orElse(ResponseEntity.notFound().build());
    }
}