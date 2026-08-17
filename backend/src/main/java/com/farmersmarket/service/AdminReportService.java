package com.farmersmarket.service;

import com.farmersmarket.entity.CustomerProfile;
import com.farmersmarket.entity.FarmerProfile;
import com.farmersmarket.entity.Order;
import com.farmersmarket.entity.OrderItem;
import com.farmersmarket.entity.Product;
import com.farmersmarket.entity.User;
import com.farmersmarket.repository.CustomerProfileRepository;
import com.farmersmarket.repository.FarmerProfileRepository;
import com.farmersmarket.repository.OrderItemRepository;
import com.farmersmarket.repository.OrderRepository;
import com.farmersmarket.repository.ProductRepository;
import com.farmersmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AdminReportService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final UserRepository userRepository;

    @Autowired
    public AdminReportService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            FarmerProfileRepository farmerProfileRepository,
            CustomerProfileRepository customerProfileRepository,
            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.farmerProfileRepository = farmerProfileRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public String generateOrdersCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("Order ID,Customer Name,Customer Email,Total Amount (INR),Order Status,Payment Status,Delivery Status,Date\n");
        List<Order> orders = orderRepository.findAll();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (Order o : orders) {
            String custName = (o.getCustomer() != null && o.getCustomer().getFullName() != null) ? o.getCustomer().getFullName() : "N/A";
            String custEmail = (o.getCustomer() != null && o.getCustomer().getUser() != null) ? o.getCustomer().getUser().getEmail() : "N/A";
            String deliveryStatus = (o.getDelivery() != null) ? o.getDelivery().getStatus().name() : "N/A";
            String dateStr = (o.getCreatedAt() != null) ? o.getCreatedAt().format(dtf) : "";

            sb.append(escapeCsv(o.getId().toString())).append(",")
              .append(escapeCsv(custName)).append(",")
              .append(escapeCsv(custEmail)).append(",")
              .append(o.getTotalAmount() != null ? o.getTotalAmount().toString() : "0.00").append(",")
              .append(escapeCsv(o.getStatus().name())).append(",")
              .append(escapeCsv(o.getPaymentStatus().name())).append(",")
              .append(escapeCsv(deliveryStatus)).append(",")
              .append(escapeCsv(dateStr)).append("\n");
        }
        return sb.toString();
    }

    @Transactional(readOnly = true)
    public String generateProductsCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("Product ID,Title,Category,Farmer Farm,Price Per Unit (INR),Unit,Stock Quantity,Low Stock Threshold,Active Status\n");
        List<Product> products = productRepository.findAll();

        for (Product p : products) {
            String category = (p.getCategory() != null) ? p.getCategory().getName() : "Uncategorized";
            String farm = (p.getFarmer() != null) ? p.getFarmer().getFarmName() : "N/A";
            int stock = (p.getInventory() != null) ? p.getInventory().getStockQuantity() : 0;
            int threshold = (p.getInventory() != null) ? p.getInventory().getLowStockThreshold() : 5;

            sb.append(escapeCsv(p.getId().toString())).append(",")
              .append(escapeCsv(p.getTitle())).append(",")
              .append(escapeCsv(category)).append(",")
              .append(escapeCsv(farm)).append(",")
              .append(p.getPricePerUnit() != null ? p.getPricePerUnit().toString() : "0.00").append(",")
              .append(escapeCsv(p.getUnit())).append(",")
              .append(stock).append(",")
              .append(threshold).append(",")
              .append(Boolean.TRUE.equals(p.getIsActive()) ? "ACTIVE" : "INACTIVE").append("\n");
        }
        return sb.toString();
    }

    @Transactional(readOnly = true)
    public String generateFarmersCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("Farmer ID,Farm Name,Owner Name,Email,Phone,Rating,Address,Status\n");
        List<FarmerProfile> farmers = farmerProfileRepository.findAll();

        for (FarmerProfile f : farmers) {
            String name = (f.getUser() != null) ? f.getUser().getName() : "N/A";
            String email = (f.getUser() != null) ? f.getUser().getEmail() : "N/A";
            String phone = (f.getUser() != null) ? f.getUser().getPhone() : "N/A";
            String status = (f.getUser() != null) ? f.getUser().getStatus() : "ACTIVE";

            sb.append(escapeCsv(f.getId().toString())).append(",")
              .append(escapeCsv(f.getFarmName())).append(",")
              .append(escapeCsv(name)).append(",")
              .append(escapeCsv(email)).append(",")
              .append(escapeCsv(phone)).append(",")
              .append(f.getRating() != null ? f.getRating().toString() : "0.00").append(",")
              .append(escapeCsv(f.getFarmAddress())).append(",")
              .append(escapeCsv(status)).append("\n");
        }
        return sb.toString();
    }

    @Transactional(readOnly = true)
    public String generateCustomersCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("Customer ID,Full Name,Email,Phone,Status,Created At\n");
        List<CustomerProfile> customers = customerProfileRepository.findAll();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (CustomerProfile c : customers) {
            String email = (c.getUser() != null) ? c.getUser().getEmail() : "N/A";
            String status = (c.getUser() != null) ? c.getUser().getStatus() : "ACTIVE";
            String dateStr = (c.getCreatedAt() != null) ? c.getCreatedAt().format(dtf) : "";

            sb.append(escapeCsv(c.getId().toString())).append(",")
              .append(escapeCsv(c.getFullName())).append(",")
              .append(escapeCsv(email)).append(",")
              .append(escapeCsv(c.getPhoneNumber() != null ? c.getPhoneNumber() : "N/A")).append(",")
              .append(escapeCsv(status)).append(",")
              .append(escapeCsv(dateStr)).append("\n");
        }
        return sb.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
