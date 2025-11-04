package com.proximusinspired.billing.service;

import com.proximusinspired.billing.api.InvoiceMapper;
import com.proximusinspired.billing.api.InvoiceResponse;
import com.proximusinspired.billing.domain.Invoice;
import com.proximusinspired.billing.domain.InvoiceRepository;
import com.proximusinspired.billing.domain.InvoiceStatus;
import com.proximusinspired.billing.order.OrderClient;
import com.proximusinspired.billing.order.OrderNotAccessibleException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final OrderClient orderClient;

    public InvoiceService(InvoiceRepository invoiceRepository, OrderClient orderClient) {
        this.invoiceRepository = invoiceRepository;
        this.orderClient = orderClient;
    }

    @Transactional
    public InvoiceResponse createInvoice(Long userId, Long orderId, String bearerToken) {
        return invoiceRepository.findByOrderIdAndUserId(orderId, userId)
                .map(InvoiceMapper::toResponse)
                .orElseGet(() -> createFreshInvoice(userId, orderId, bearerToken));
    }

    private InvoiceResponse createFreshInvoice(Long userId, Long orderId, String bearerToken) {
        var order = orderClient.getOrder(orderId, bearerToken);
        Invoice invoice = new Invoice();
        invoice.setOrderId(order.id());
        invoice.setUserId(userId);
        invoice.setAmount(order.total());
        Invoice saved = invoiceRepository.save(invoice);
        return InvoiceMapper.toResponse(saved);
    }

    @Transactional
    public InvoiceResponse payInvoice(Long userId, Long invoiceId) {
        Invoice invoice = invoiceRepository.findByIdAndUserId(invoiceId, userId)
                .orElseThrow(() -> new BillingServiceException("Invoice not found"));
        if (invoice.getStatus() == InvoiceStatus.PAID) {
            return InvoiceMapper.toResponse(invoice);
        }
        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setPaidAt(Instant.now());
        return InvoiceMapper.toResponse(invoice);
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> myInvoices(Long userId) {
        return invoiceRepository.findByUserIdOrderByIssuedAtDesc(userId).stream()
                .map(InvoiceMapper::toResponse)
                .toList();
    }
}
