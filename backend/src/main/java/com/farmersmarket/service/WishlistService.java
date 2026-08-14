package com.farmersmarket.service;

import com.farmersmarket.dto.WishlistItemResponse;
import com.farmersmarket.entity.CustomerProfile;
import com.farmersmarket.entity.Product;
import com.farmersmarket.entity.User;
import com.farmersmarket.entity.Wishlist;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.ProductRepository;
import com.farmersmarket.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final CustomerProfileService customerProfileService;

    @Autowired
    public WishlistService(
            WishlistRepository wishlistRepository,
            ProductRepository productRepository,
            CustomerProfileService customerProfileService) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.customerProfileService = customerProfileService;
    }

    /**
     * Get authenticated customer's wishlist with full product and grower details.
     */
    @Transactional(readOnly = true)
    public List<WishlistItemResponse> getWishlist(User customerUser) {
        CustomerProfile profile = customerProfileService.getOrCreateCustomerProfileEntity(customerUser);
        List<Wishlist> list = wishlistRepository.findByCustomerIdWithDetails(profile.getId());
        return list.stream()
                .map(WishlistItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Add product to wishlist. Duplicate additions are idempotent.
     */
    @Transactional
    public List<WishlistItemResponse> addToWishlist(User customerUser, UUID productId) {
        CustomerProfile profile = customerProfileService.getOrCreateCustomerProfileEntity(customerUser);

        Product product = productRepository.findByIdWithDetails(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + productId + " was not found."));

        if (product.getIsActive() == null || !product.getIsActive()) {
            throw new IllegalArgumentException("Product '" + product.getTitle() + "' is inactive and cannot be saved to wishlist.");
        }

        Optional<Wishlist> existing = wishlistRepository.findByCustomer_IdAndProduct_Id(profile.getId(), product.getId());
        if (existing.isEmpty()) {
            Wishlist wishlist = new Wishlist(profile, product);
            wishlistRepository.save(wishlist);
        }

        return getWishlist(customerUser);
    }

    /**
     * Remove product from wishlist.
     */
    @Transactional
    public List<WishlistItemResponse> removeFromWishlist(User customerUser, UUID productId) {
        CustomerProfile profile = customerProfileService.getOrCreateCustomerProfileEntity(customerUser);
        wishlistRepository.deleteByCustomer_IdAndProduct_Id(profile.getId(), productId);
        return getWishlist(customerUser);
    }
}
