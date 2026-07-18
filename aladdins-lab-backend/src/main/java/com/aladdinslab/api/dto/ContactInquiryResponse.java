package com.aladdinslab.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactInquiryResponse {

    private Long id;
    private String name;
    private String email;
    private String inquiryType;
    private String message;
    private LocalDateTime createdAt;
}