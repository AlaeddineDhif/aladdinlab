package com.aladdinslab.api.controller;

import com.aladdinslab.api.dto.ContactInquiryRequest;
import com.aladdinslab.api.dto.ContactInquiryResponse;
import com.aladdinslab.api.service.ContactInquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/inquiries")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class ContactInquiryController {

    private final ContactInquiryService service;

    @PostMapping
    public ResponseEntity<ContactInquiryResponse> createInquiry(
            @Valid @RequestBody ContactInquiryRequest request) {
        ContactInquiryResponse response = service.createInquiry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}