import { useMutation } from '@tanstack/react-query';
import { AuthContext } from 'context/Auth';
import { CartContext } from 'context/Cart';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { cartApi } from 'utils/api/cart';

export default function useCartManagement() {
  const { cartInfo, refetchCartInfo, cartDetail, refetchCartDetail } = useContext(CartContext);
  const { isAuthenticated, userInfo } = useContext(AuthContext);

  const { mutate: createCart } = useMutation({
    mutationKey: [cartApi.createKey],
    mutationFn: cartApi.create,
    onSuccess: () => {
      refetchCartInfo();
      refetchCartDetail();
      toast.success('Thêm sản phẩm vào giỏ hàng thành công');
    },
  });

  const { mutate: updateCart } = useMutation({
    mutationKey: [cartApi.updateKey],
    mutationFn: cartApi.update,
    onSuccess: () => {
      refetchCartInfo();
      refetchCartDetail();
    },
  });

  useEffect(() => {
    if (cartDetail.cart) {
      const totalPrice = cartDetail.items
        .map((item) => item.total)
        .reduce((total1, total2) => total1 + total2, 0);
      if (totalPrice !== cartDetail.cart.totalPrice) {
        updateCart({ data: { totalPrice }, id: cartDetail.cart.id });
      }
    }
  }, [cartDetail]);

  const { mutate: addItemToCart, isLoading: isAdding } = useMutation({
    mutationKey: [cartApi.createItemKey],
    mutationFn: cartApi.createItem,
    onSuccess: () => {
      refetchCartDetail();
      toast.success('Thêm sản phẩm vào giỏ hàng thành công');
    },
    onError: () => {
      toast.error('Thêm sản phẩm vào giỏ hàng thất bại! Vui lòng thử lại sau');
    },
  });

  const { mutate: updateItemInCart, isLoading: isUpdating } = useMutation({
    mutationKey: [cartApi.updateItemKey],
    mutationFn: cartApi.updateItem,
    onSuccess: () => {
      refetchCartDetail();
    },
  });

  const { mutate: deleteItemFromCart, isLoading: isRemoving } = useMutation({
    mutationKey: [cartApi.removeItemKey],
    mutationFn: cartApi.removeItem,
    onSuccess: () => {
      refetchCartDetail();
    },
  });

  const onAddItem = (item, quantity = 1) => {
    if (isAuthenticated) {
      const itemData = {
        productId: item.id,
        quantity: quantity,
        price: item.price,
        total: item.price * quantity,
      };
      if (cartInfo === null) {
        createCart({
          cart: {
            totalPrice: itemData.total,
            userId: userInfo.id,
          },
          itemArr: [itemData],
        });
      } else if (cartInfo && cartDetail.cart) {
        const existItem = cartDetail.items.find((i) => i.itemCartInfo?.id === item.id);
        if (existItem) {
          const sumQuantity = existItem.quantity + quantity;
          updateItemInCart(
            { id: existItem.id, quantity: sumQuantity, total: existItem.price * sumQuantity },
            {
              onSuccess: (_, data) => {
                toast.success('Thêm sản phẩm vào giỏ hàng thành công');
              },
              onError: () => {
                toast.error('Thêm sản phẩm vào giỏ hàng thất bại! Vui lòng thử lại sau');
              },
            }
          );
        } else {
          addItemToCart({
            ...itemData,
            cartId: cartInfo.id,
          });
        }
      }
    } else {
      toast.error('Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng');
    }
  };

  const onUpdateItem = (id, quantity) => {
    const existItem = cartDetail.items.find((i) => i.id === id);
    updateItemInCart({ id, quantity, total: existItem.price * quantity });
  };

  const onRemoveItem = (id) => {
    deleteItemFromCart(id);
  };

  const { mutate: onRemoveCart } = useMutation({
    mutationKey: [cartApi.removeKey],
    mutationFn: cartApi.remove,
    onSuccess: () => {
      refetchCartInfo();
      refetchCartDetail();
    },
  });

  return {
    onAddItem,
    onUpdateItem,
    onRemoveItem,
    onRemoveCart,
    isAdding,
    isUpdating,
    isRemoving,
  };
}
