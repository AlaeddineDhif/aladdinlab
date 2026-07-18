package com.aladdinslab.api.service;

import com.aladdinslab.api.dto.ContactInquiryRequest;
import com.aladdinslab.api.dto.ContactInquiryResponse;
import com.aladdinslab.api.entity.ContactInquiry;
import com.aladdinslab.api.repository.ContactInquiryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactInquiryService {

    private final ContactInquiryRepository repository;

    @Transactional
    public ContactInquiryResponse createInquiry(ContactInquiryRequest request) {
        ContactInquiry inquiry = ContactInquiry.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .inquiryType(request.getInquiryType())
                .message(request.getMessage().trim())
                .build();

        ContactInquiry saved = repository.save(inquiry);
        log.info("New inquiry created: id={}, type={}, email={}", saved.getId(), saved.getInquiryType(), saved.getEmail());

        return mapToResponse(saved);
    }

    private ContactInquiryResponse mapToResponse(ContactInquiry inquiry) {
        return ContactInquiryResponse.builder()
                .id(inquiry.getId())
                .name(inquiry.getName())
                .email(inquiry.getEmail())
                .inquiryType(inquiry.getInquiryType())
                .message(inquiry.getMessage())
                .createdAt(inquiry.getCreatedAt())
                .build();
    }
}