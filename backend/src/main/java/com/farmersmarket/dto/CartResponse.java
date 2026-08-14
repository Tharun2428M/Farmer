package com.farmersmarket.dto;

import com.farmersmarket.entity.Cart;
import com.farmersmarket.entity.CartItem;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class CartResponse {

    private UUID cartId;
    private List<CartItemResponse> items = new ArrayList<>();
    private int totalQuantity = 0;
    private BigDecimal totalAmount = BigDecimal.ZERO;

    public CartResponse() {
    }

    public static CartResponse fromCartAndItems(UUID cartId, List<CartItem> items) {
        CartResponse response = new CartResponse();
        response.setCartId(cartId);

        if (items != null) {
            List<CartItemResponse> itemDtos = items.stream()
                    .map(CartItemResponse::fromEntity)
                    .collect(Collectors.toList());
            response.setItems(itemDtos);

            int totalQty = itemDtos.stream()
                    .mapToInt(i -> i.getQuantity() != null ? i.getQuantity() : 0)
                    .sum();
            response.setTotalQuantity(totalQty);

            BigDecimal total = itemDtos.stream()
                    .map(CartItemResponse::getSubtotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            response.setTotalAmount(total);
        }

        return response;
    }

    public static CartResponse fromEntity(Cart cart) {
        if (cart == null) {
            return new CartResponse();
        }
        return fromCartAndItems(cart.getId(), cart.getItems());
    }

    public UUID getCartId() {
        return cartId;
    }

    public void setCartId(UUID cartId) {
        this.cartId = cartId;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }

    public void setItems(List<CartItemResponse> items) {
        this.items = items;
    }

    public int getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(int totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
