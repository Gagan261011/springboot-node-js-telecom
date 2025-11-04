package com.proximusinspired.billing.service;

import com.proximusinspired.billing.api.InvoiceResponse;
import com.proximusinspired.billing.domain.InvoiceRepository;
import com.proximusinspired.billing.domain.InvoiceStatus;
import com.proximusinspired.billing.order.OrderClient;
import com.proximusinspired.billing.order.OrderClient.OrderSummary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.annotation.DirtiesContext;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class InvoiceServiceTests {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @MockBean
    private OrderClient orderClient;

    @BeforeEach
    void setup() {
        when(orderClient.getOrder(anyLong(), anyString()))
                .thenReturn(new OrderSummary(55L, BigDecimal.valueOf(42.50), "CREATED"));
    }

    @Test
    void createInvoicePersistsPendingInvoice() {
        InvoiceResponse response = invoiceService.createInvoice(10L, 55L, "Bearer token");
        assertThat(response.amount()).isEqualByComparingTo(BigDecimal.valueOf(42.50));
        assertThat(response.status()).isEqualTo(InvoiceStatus.PENDING);
        assertThat(invoiceRepository.count()).isEqualTo(1);
    }

    @Test
    void createInvoiceReturnsExistingInstance() {
        invoiceService.createInvoice(10L, 55L, "Bearer token");
        invoiceService.createInvoice(10L, 55L, "Bearer token");
        verify(orderClient, times(1)).getOrder(anyLong(), anyString());
        assertThat(invoiceRepository.count()).isEqualTo(1);
    }

    @Test
    void payInvoiceMarksAsPaid() {
        InvoiceResponse invoice = invoiceService.createInvoice(10L, 55L, "Bearer token");
        InvoiceResponse paid = invoiceService.payInvoice(10L, invoice.id());
        assertThat(paid.status()).isEqualTo(InvoiceStatus.PAID);
        assertThat(paid.paidAt()).isNotNull();
    }

    @Test
    void payInvoiceFailsForUnknownInvoice() {
        assertThatThrownBy(() -> invoiceService.payInvoice(10L, 999L))
                .isInstanceOf(BillingServiceException.class);
    }

    @Test
    void myInvoicesReturnsList() {
        invoiceService.createInvoice(10L, 55L, "Bearer token");
        List<InvoiceResponse> invoices = invoiceService.myInvoices(10L);
        assertThat(invoices).hasSize(1);
    }
}
