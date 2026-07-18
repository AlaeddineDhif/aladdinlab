package com.aladdinslab.api.repository;

import com.aladdinslab.api.entity.ContactInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactInquiryRepository extends JpaRepository<ContactInquiry, Long> {

    List<ContactInquiry> findByInquiryTypeOrderByCreatedAtDesc(String inquiryType);
}