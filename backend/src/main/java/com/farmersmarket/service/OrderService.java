package com.farmersmarket.service;

import com.farmersmarket.dto.CreateOrderRequest;
import com.farmersmarket.dto.DeliveryResponse;
import com.farmersmarket.dto.OrderResponse;
import com.farmersmarket.entity.Address;
import com.farmersmarket.entity.Cart;
import com.farmersmarket.entity.CartItem;
import com.farmersmarket.entity.CustomerProfile;
import com.farmersmarket.entity.Delivery;
import com.farmersmarket.entity.DeliveryStatus;
import com.farmersmarket.entity.FarmerProfile;
import com.farmersmarket.entity.Inventory;
import com.farmersmarket.entity.NotificationType;
import com.farmersmarket.entity.Order;
import com.farmersmarket.entity.OrderItem;
import com.farmersmarket.entity.OrderPaymentStatus;
import com.farmersmarket.entity.OrderStatus;
import com.farmersmarket.entity.Payment;
import com.farmersmarket.entity.PaymentMethod;
import com.farmersmarket.entity.PaymentStatus;
import com.farmersmarket.entity.Product;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.InsufficientStockException;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.CartItemRepository;
import com.farmersmarket.repository.CartRepository;
import com.farmersmarket.repository.DeliveryRepository;
import com.farmersmarket.repository.InventoryRepository;
import com.farmersmarket.repository.OrderItemRepository;
import com.farmersmarket.repository.OrderRepository;
import com.farmersmarket.repository.PaymentRepository;
import com.farmersmarket.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final DeliveryRepository deliveryRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final CustomerProfileService customerProfileService;
    private final AddressService addressService;
    private final NotificationService notificationService;

    @Autowired
    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            PaymentRepository paymentRepository,
            DeliveryRepository deliveryRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            InventoryRepository inventoryRepository,
            ProductRepository productRepository,
            CustomerProfileService customerProfileService,
            AddressService addressService,
            NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.deliveryRepository = deliveryRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.customerProfileService = customerProfileService;
        this.addressService = addressService;
        this.notificationService = notificationService;
    }

    /**
     * Get list of all orders placed by the authenticated customer.
     */
    @Transactional(readOnly = true)
    public List<OrderResponse> getCustomerOrders(User customerUser) {
        CustomerProfile customer = customerProfileService.getOrCreateCustomerProfileEntity(customerUser);
        List<Order> orders = orderRepository.findByCustomer_IdOrderByCreatedAtDesc(customer.getId());
        return orders.stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get detailed order info by ID (Customer ownership verified).
     */
    @Transactional(readOnly = true)
    public OrderResponse getCustomerOrderById(User customerUser, UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " was not found."));

        if (!order.getCustomer().getId().equals(customerUser.getId())) {
            throw new AccessDeniedException("You do not have permission to view this order.");
        }

        return OrderResponse.fromEntity(order);
    }

    /**
     * Get delivery tracking info for customer order.
     */
    @Transactional(readOnly = true)
    public DeliveryResponse getCustomerOrderDelivery(User customerUser, UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " was not found."));

        if (!order.getCustomer().getId().equals(customerUser.getId())) {
            throw new AccessDeniedException("You do not have permission to view tracking for this order.");
        }

        Delivery delivery = deliveryRepository.findByOrder_Id(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery record not found for order " + orderId));

        return DeliveryResponse.fromEntity(delivery);
    }

    /**
     * Atomic transaction creating Order, Items snapshot, Payment, Delivery, reducing Inventory,
     * clearing Cart, and sending notifications.
     */
    @Transactional
    public OrderResponse placeOrder(User customerUser, CreateOrderRequest request) {
        CustomerProfile customer = customerProfileService.getOrCreateCustomerProfileEntity(customerUser);

        // 1. Verify Address
        Address address = addressService.getAddressEntity(customerUser, request.getAddressId());

        // 2. Fetch Customer's Cart Items
        Optional<Cart> cartOpt = cartRepository.findByCustomer_Id(customer.getId());
        if (cartOpt.isEmpty()) {
            throw new IllegalArgumentException("Your shopping cart is empty. Please add farm produce before checking out.");
        }

        Cart cart = cartOpt.get();
        List<CartItem> cartItems = cartItemRepository.findByCartIdWithDetails(cart.getId());
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Your shopping cart is empty. Please add farm produce before checking out.");
        }

        // 3. Validate Produce status and live stock
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItemsToSave = new ArrayList<>();
        Set<FarmerProfile> farmersInvolved = new HashSet<>();

        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (product == null || Boolean.FALSE.equals(product.getIsActive())) {
                throw new IllegalArgumentException("Produce '" + (product != null ? product.getTitle() : "Unknown") + "' is no longer available.");
            }

            Inventory inventory = product.getInventory();
            int currentStock = inventory != null ? inventory.getStockQuantity() : 0;
            if (item.getQuantity() > currentStock) {
                throw new InsufficientStockException("Insufficient harvest stock for '" + product.getTitle() + 
                        "'. Requested: " + item.getQuantity() + " " + product.getUnit() + 
                        ", Available: " + currentStock + " " + product.getUnit());
            }

            // Deduct stock safely
            inventory.setStockQuantity(currentStock - item.getQuantity());
            inventoryRepository.save(inventory);

            // Compute historical subtotal snapshot
            BigDecimal itemPrice = product.getPricePerUnit();
            BigDecimal itemSubtotal = itemPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(itemSubtotal);

            // Prepare OrderItem
            OrderItem orderItem = new OrderItem(
                    null, // set order below
                    product,
                    product.getFarmer(),
                    item.getQuantity(),
                    itemPrice,
                    itemSubtotal
            );
            orderItemsToSave.add(orderItem);

            if (product.getFarmer() != null) {
                farmersInvolved.add(product.getFarmer());
            }
        }

        // 4. Create Order Entity
        Order order = new Order(customer, totalAmount, address);
        Order savedOrder = orderRepository.save(order);

        // Associate items with saved order
        for (OrderItem oi : orderItemsToSave) {
            oi.setOrder(savedOrder);
        }
        orderItemRepository.saveAll(orderItemsToSave);
        savedOrder.setItems(orderItemsToSave);

        // 5. Handle Payment
        PaymentMethod paymentMethod = request.getPaymentMethod();
        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setAmount(totalAmount);
        payment.setPaymentMethod(paymentMethod);

        if (paymentMethod == PaymentMethod.CASH_ON_DELIVERY) {
            payment.setStatus(PaymentStatus.PENDING);
            payment.setTransactionReference("COD-" + savedOrder.getId().toString().substring(0, 8).toUpperCase());
            savedOrder.setStatus(OrderStatus.CONFIRMED);
            savedOrder.setPaymentStatus(OrderPaymentStatus.PENDING);
        } else {
            // Online Safe Sandbox Simulation
            boolean isSuccess = request.getSimulatePaymentSuccess();
            if (isSuccess) {
                payment.setStatus(PaymentStatus.SUCCESS);
                payment.setTransactionReference(request.getTransactionReference() != null ? 
                        request.getTransactionReference() : "TEST-TXN-" + System.currentTimeMillis());
                savedOrder.setStatus(OrderStatus.CONFIRMED);
                savedOrder.setPaymentStatus(OrderPaymentStatus.PAID);
            } else {
                payment.setStatus(PaymentStatus.FAILED);
                payment.setTransactionReference("FAILED-TXN-" + System.currentTimeMillis());
                savedOrder.setStatus(OrderStatus.PENDING);
                savedOrder.setPaymentStatus(OrderPaymentStatus.FAILED);
            }
        }
        paymentRepository.save(payment);
        savedOrder.setPayment(payment);

        // 6. Handle Delivery Record
        Delivery delivery = new Delivery(
                savedOrder,
                DeliveryStatus.PENDING,
                LocalDateTime.now().plusDays(3)
        );
        deliveryRepository.save(delivery);
        savedOrder.setDelivery(delivery);

        // Re-save order with payment and delivery relationships
        orderRepository.save(savedOrder);

        // 7. Clear Customer Cart
        cartItemRepository.deleteByCart_Id(cart.getId());

        // 8. Trigger Notifications
        String orderShortId = savedOrder.getId().toString().substring(0, 8).toUpperCase();
        notificationService.sendNotification(
                customerUser,
                "Order Placed #" + orderShortId,
                "Your farm produce order of ₹" + totalAmount + " has been placed (" + savedOrder.getStatus() + ").",
                NotificationType.ORDER_PLACED
        );

        for (FarmerProfile farmer : farmersInvolved) {
            if (farmer.getUser() != null) {
                notificationService.sendNotification(
                        farmer.getUser(),
                        "New Crop Order #" + orderShortId,
                        "You received a new purchase order containing produce from " + farmer.getFarmName() + ".",
                        NotificationType.NEW_ORDER_FOR_FARMER
                );
            }
        }

        return OrderResponse.fromEntity(savedOrder);
    }

    /**
     * Cancel customer order before shipment and restore product inventory.
     */
    @Transactional
    public OrderResponse cancelOrder(User customerUser, UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " was not found."));

        if (!order.getCustomer().getId().equals(customerUser.getId())) {
            throw new AccessDeniedException("You do not have permission to cancel this order.");
        }

        // Check cancellation eligibility
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalArgumentException("Order cannot be cancelled at status '" + order.getStatus() + 
                    "'. Only orders prior to processing/shipment can be cancelled.");
        }

        // Restore inventory for all order items
        List<OrderItem> items = orderItemRepository.findByOrder_Id(orderId);
        for (OrderItem item : items) {
            if (item.getProduct() != null && item.getProduct().getInventory() != null) {
                Inventory inv = item.getProduct().getInventory();
                inv.setStockQuantity(inv.getStockQuantity() + item.getQuantity());
                inventoryRepository.save(inv);
            }
        }

        // Update Payment status if paid
        if (order.getPaymentStatus() == OrderPaymentStatus.PAID) {
            order.setPaymentStatus(OrderPaymentStatus.REFUNDED);
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order saved = orderRepository.save(order);

        // Send cancellation notification
        String orderShortId = order.getId().toString().substring(0, 8).toUpperCase();
        notificationService.sendNotification(
                customerUser,
                "Order Cancelled #" + orderShortId,
                "Your order #" + orderShortId + " has been cancelled and stock was returned to the growers.",
                NotificationType.ORDER_CANCELLED
        );

        return OrderResponse.fromEntity(saved);
    }
}
