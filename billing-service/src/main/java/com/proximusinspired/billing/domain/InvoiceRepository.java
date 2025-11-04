package com.proximusinspired.billing.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByUserIdOrderByIssuedAtDesc(Long userId);
    Optional<Invoice> findByIdAndUserId(Long id, Long userId);
    Optional<Invoice> findByOrderIdAndUserId(Long orderId, Long userId);
}
