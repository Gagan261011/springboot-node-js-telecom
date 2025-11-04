package com.proximusinspired.billing.api;

import com.proximusinspired.billing.security.JwtPrincipal;
import com.proximusinspired.billing.service.InvoiceService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final InvoiceService invoiceService;

    public BillingController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping("/invoice/{orderId}")
    public ResponseEntity<InvoiceResponse> createInvoice(@AuthenticationPrincipal JwtPrincipal principal,
                                                         @PathVariable Long orderId,
                                                         @RequestHeader(HttpHeaders.AUTHORIZATION) @NotBlank String authorization) {
        InvoiceResponse response = invoiceService.createInvoice(principal.userId(), orderId, authorization);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/pay/{invoiceId}")
    public ResponseEntity<InvoiceResponse> pay(@AuthenticationPrincipal JwtPrincipal principal,
                                               @PathVariable Long invoiceId) {
        return ResponseEntity.ok(invoiceService.payInvoice(principal.userId(), invoiceId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<InvoiceResponse>> myInvoices(@AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(invoiceService.myInvoices(principal.userId()));
    }
}
