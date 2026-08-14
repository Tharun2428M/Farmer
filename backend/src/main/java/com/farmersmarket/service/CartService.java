package com.farmersmarket.service;

import com.farmersmarket.dto.AddToCartRequest;
import com.farmersmarket.dto.CartResponse;
import com.farmersmarket.dto.UpdateCartItemRequest;
import com.farmersmarket.entity.Cart;
import com.farmersmarket.entity.CartItem;
import com.farmersmarket.entity.CustomerProfile;
import com.farmersmarket.entity.Product;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.InsufficientStockException;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.CartItemRepository;
import com.farmersmarket.repository.CartRepository;
import com.farmersmarket.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CustomerProfileService customerProfileService;

    @Autowired
    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            CustomerProfileService customerProfileService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.customerProfileService = customerProfileService;
    }

    /**
     * Get or initialize the customer's shopping cart.
     */
    @Transactional
    public Cart getOrCreateCartEntity(User customerUser) {
        CustomerProfile customerProfile = customerProfileService.getOrCreateCustomerProfileEntity(customerUser);
        return cartRepository.findByCustomer_Id(customerProfile.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart(customerProfile);
                    return cartRepository.save(newCart);
                });
    }

    /**
     * Get customer's cart with calculated item subtotals and total amounts.
     */
    @Transactional(readOnly = true)
    public CartResponse getCart(User customerUser) {
        CustomerProfile customerProfile = customerProfileService.getOrCreateCustomerProfileEntity(customerUser);
        Optional<Cart> cartOptional = cartRepository.findByCustomer_Id(customerProfile.getId());
        if (cartOptional.isEmpty()) {
            return new CartResponse();
        }

        Cart cart = cartOptional.get();
        List<CartItem> items = cartItemRepository.findByCartIdWithDetails(cart.getId());
        return CartResponse.fromCartAndItems(cart.getId(), items);
    }

    /**
     * Add product to cart with strict inventory stock validation.
     * If item is already in cart, increases quantity.
     */
    @Transactional
    public CartResponse addToCart(User customerUser, AddToCartRequest request) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be at least 1.");
        }

        Cart cart = getOrCreateCartEntity(customerUser);

        Product product = productRepository.findByIdWithDetails(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + request.getProductId() + " was not found."));

        if (product.getIsActive() == null || !product.getIsActive()) {
            throw new IllegalArgumentException("Product '" + product.getTitle() + "' is currently deactivated or unavailable.");
        }

        int availableStock = product.getInventory() != null ? product.getInventory().getStockQuantity() : 0;
        if (availableStock <= 0) {
            throw new InsufficientStockException("Product '" + product.getTitle() + "' is out of stock.");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCart_IdAndProduct_Id(cart.getId(), product.getId());
        int currentQtyInCart = existingItemOpt.map(CartItem::getQuantity).orElse(0);
        int finalQuantity = currentQtyInCart + request.getQuantity();

        if (finalQuantity > availableStock) {
            throw new InsufficientStockException("Requested total quantity (" + finalQuantity + " " + product.getUnit() + 
                    ") exceeds available farm harvest stock (" + availableStock + " " + product.getUnit() + ").");
        }

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(finalQuantity);
            cartItemRepository.saveAndFlush(existingItem);
        } else {
            CartItem newItem = new CartItem(cart, product, finalQuantity);
            cartItemRepository.saveAndFlush(newItem);
        }

        List<CartItem> items = cartItemRepository.findByCartIdWithDetails(cart.getId());
        return CartResponse.fromCartAndItems(cart.getId(), items);
    }

    /**
     * Update cart item quantity with strict ownership and stock validation.
     */
    @Transactional
    public CartResponse updateCartItemQuantity(User customerUser, UUID cartItemId, UpdateCartItemRequest request) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be at least 1. To remove, use delete endpoint.");
        }

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item with ID " + cartItemId + " was not found."));

        // Verify ownership: Item must belong to the authenticated customer
        if (!cartItem.getCart().getCustomer().getId().equals(customerUser.getId())) {
            throw new AccessDeniedException("You do not have permission to modify this cart item.");
        }

        Product product = cartItem.getProduct();
        if (product.getIsActive() == null || !product.getIsActive()) {
            throw new IllegalArgumentException("Product '" + product.getTitle() + "' is no longer active.");
        }

        int availableStock = product.getInventory() != null ? product.getInventory().getStockQuantity() : 0;
        if (request.getQuantity() > availableStock) {
            throw new InsufficientStockException("Requested quantity (" + request.getQuantity() + " " + product.getUnit() + 
                    ") exceeds available farm harvest stock (" + availableStock + " " + product.getUnit() + ").");
        }

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.saveAndFlush(cartItem);

        List<CartItem> items = cartItemRepository.findByCartIdWithDetails(cartItem.getCart().getId());
        return CartResponse.fromCartAndItems(cartItem.getCart().getId(), items);
    }

    /**
     * Remove item from cart with strict ownership check.
     */
    @Transactional
    public CartResponse removeCartItem(User customerUser, UUID cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item with ID " + cartItemId + " was not found."));

        // Verify ownership
        if (!cartItem.getCart().getCustomer().getId().equals(customerUser.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this cart item.");
        }

        UUID cartId = cartItem.getCart().getId();
        cartItemRepository.delete(cartItem);
        cartItemRepository.flush();

        List<CartItem> items = cartItemRepository.findByCartIdWithDetails(cartId);
        return CartResponse.fromCartAndItems(cartId, items);
    }

    /**
     * Clear all items from authenticated customer's cart.
     */
    @Transactional
    public CartResponse clearCart(User customerUser) {
        CustomerProfile customerProfile = customerProfileService.getOrCreateCustomerProfileEntity(customerUser);
        Optional<Cart> cartOpt = cartRepository.findByCustomer_Id(customerProfile.getId());
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            cartItemRepository.deleteByCart_Id(cart.getId());
            cartItemRepository.flush();
            return CartResponse.fromCartAndItems(cart.getId(), List.of());
        }

        return new CartResponse();
    }
}
