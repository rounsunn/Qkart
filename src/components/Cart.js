import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Divider } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
 export const generateCartItemsFrom = (cartData, productsData) => {
  let res = [];
  cartData.forEach(cartItem => {
    const product = productsData.find(productItem => productItem._id === cartItem.productId);
    if (product) {
      res.push({ ...product, qty: cartItem.qty });
    }
  });
  return res;
};


/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  return items.reduce((total, item) => total + item.qty * item.cost, 0);
};

/**
 * Get the total number of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    count of all items in the cart
 *
 */
 export const getTotalCartItemsCount = (items = []) => {
  return items.reduce((total, item) => total + item.qty, 0);
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  productId,
  handleAdd,
  handleDelete,
  isReadOnly
}) => {
  if( isReadOnly ) return (
    <Box padding="0.5rem" data-testid="item-qty">
      Qty: {value}
    </Box>
  );

  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={ () => handleDelete(productId, value - 1) } >
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={ () => handleAdd( productId, value + 1) } >
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

const DisplayCartItems = ( {cartItems, handleCart, isReadOnly} ) => (
  cartItems.map( (item) => (
    <Box display="flex" alignItems="flex-start" padding="1rem" key={item._id}>
      <Box className="image-container">
        <img src={item.image} alt={item.name} width="100%" height="100%" />
      </Box>
      <Box
        display="flex" flexDirection="column" justifyContent="space-between"
        height="6rem" paddingX="1rem"
      >
        <div>{/* Add product name */}{item.name}</div>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <ItemQuantity
          // Add required props by checking implementation
            value={item.qty}
            productId={item._id}
            handleAdd={handleCart}
            handleDelete={handleCart}
            isReadOnly={isReadOnly}
          />
          <Box padding="0.5rem" fontWeight="700">
            ${item.cost}
          </Box>
        </Box>
      </Box>
    </Box>
  ))
);

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly
}) => {
  const history = useHistory();
  // const [cartItems, setCartItems] = useState([]);
  const cartItems =  isReadOnly ? items : generateCartItemsFrom( items, products );
  console.log("CartItems is called to display added producuts", cartItems);
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        <DisplayCartItems
          cartItems={cartItems}
          handleCart={handleQuantity}
          isReadOnly={isReadOnly}
        />
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(cartItems)}
          </Box>
        </Box>
        <Divider />

        { isReadOnly ? (
          <Box className="order-details">
            <h3>Order Details</h3>
            <Box padding="1rem" display="flex" justifyContent="space-between" alignItems="center">
              <Box color="#3C3C3C" alignSelf="center">
                Products
              </Box>
              <Box color="#3C3C3C" fontWeight="700" fontSize="1.5rem" alignSelf="center" data-testid="cart-total" >
                {getTotalCartItemsCount(cartItems)}
              </Box>
            </Box>

            <Box padding="1rem" display="flex" justifyContent="space-between" alignItems="center">
              <Box color="#3C3C3C" alignSelf="center">
                Shipping Charges
              </Box>
              <Box color="#3C3C3C" fontWeight="700" fontSize="1.5rem" alignSelf="center" data-testid="cart-total" >
                ${0}
              </Box>
            </Box>

            <Box padding="1rem" display="flex" justifyContent="space-between" alignItems="center">
              <Box color="#3C3C3C" alignSelf="center">
                Total
              </Box>
              <Box color="#3C3C3C" fontWeight="700" fontSize="1.5rem" alignSelf="center" data-testid="cart-total" >
                ${getTotalCartValue(cartItems)}
              </Box>
            </Box>

          </Box>
        ) : (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => history.push("/checkout")}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Cart;
