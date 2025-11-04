package com.proximusinspired.billing.api;

import com.proximusinspired.billing.domain.Invoice;

public final class InvoiceMapper {

    private InvoiceMapper() {
    }

    public static InvoiceResponse toResponse(Invoice invoice) {
        return new InvoiceResponse(
                invoice.getId(),
                invoice.getOrderId(),
                invoice.getAmount(),
                invoice.getStatus(),
                invoice.getIssuedAt(),
                invoice.getPaidAt()
        );
    }
}
