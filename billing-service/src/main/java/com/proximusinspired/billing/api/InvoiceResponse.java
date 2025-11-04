package com.proximusinspired.billing.api;

import com.proximusinspired.billing.domain.InvoiceStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record InvoiceResponse(
        Long id,
        Long orderId,
        BigDecimal amount,
        InvoiceStatus status,
        Instant issuedAt,
        Instant paidAt
) {
}
