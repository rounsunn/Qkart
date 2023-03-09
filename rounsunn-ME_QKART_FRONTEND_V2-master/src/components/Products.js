import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard"
import Cart from "./Cart"
import { Construction } from "@mui/icons-material"; // eslint-disable-line

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const GET_API = `${config.endpoint}/products`;

  const token = localStorage.getItem("token");

  const { enqueueSnackbar } = useSnackbar();

  const [allProductList, setAllProductList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    // await new Promise(r => setTimeout(r, 2000));
    try {
      const res = await axios.get(GET_API);
      setIsLoading(false);
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

    /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
     const fetchCart = async (token) => {
      if (!token) return;
  
      try {
        // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data4
        const GET_API = `${config.endpoint}/cart`;
        const res = await axios.get(GET_API, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        return res.data;
      } catch (e) {
        if (e.response && e.response.status === 400) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
            { variant: "error" }
          );
        }
        return null;
      }
    };

  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await performAPICall(); 
      const cartData = await fetchCart(token);
      setAllProductList([...productsData]);
      setProductList([...productsData]);
      if( cartData) setItemList([...cartData]);
    };
    onLoadHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    const SEARCH_API = `${GET_API}/search?value=${text}`;
    try {
      const res = await axios.get(SEARCH_API);
      // console.log(res.data);
      setProductList([...res.data]);
    } catch (e) {
      // console.log(e.response);
      setProductList([]);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    // console.log( event, debounceTimeout );
    let timeout;

    // This is the function that is returned and will be executed many times
    // We spread (...args) to capture any number of parameters we want to pass
    return function executedFunction(...args) {

      // The callback function to be executed after 
      // the debounce time has elapsed
      const later = () => {
        // null timeout to indicate the debounce ended
        timeout = null;
        
        // Execute the callback
        event(...args);
      };
      // This will reset the waiting every function execution.
      // This is the step that prevents the function from
      // being executed because it will never reach the 
      // inside of the previous setTimeout  
      clearTimeout(timeout);
      
      // Restart the debounce waiting period.
      // setTimeout returns a truthy value (it differs in web vs Node)
      timeout = setTimeout(later, debounceTimeout);
    };
  };

  const debouncedSearchInbox = debounceSearch(performSearch, 500);


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    // console.log( items, productId );
    return !!items.find( (item) => item.productId === productId );
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async ( productId, qty, options = { preventDuplicate: false } ) => {
    if( !token ){
      enqueueSnackbar("Login to add an item to the Cart", { variant: "warning" });
      return null;
    }

    const items = itemList;

    // console.log( isItemInCart(items, productId ), options.preventDuplicate );
    const isDuplicate = options.preventDuplicate && isItemInCart(items, productId);
    if (isDuplicate) {
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", { variant: "warning" });
      return null;
    }

    try {
      const POST_API = `${config.endpoint}/cart`;
      const res = await axios.post(POST_API, { productId, qty }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      console.log(res);
      setItemList([...res.data]);
    } catch (e) {
      console.log(e.response)
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Error in Adding to cart: Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

// Display product utilities 
  
  const DisplayProducts = () => {
    if (isLoading) {
      return (
        <>
          <p>Loading Products</p>
          <CircularProgress />
        </>
      );
    }
  
    if (!productList.length) {
      return (
        <Box display="flex" alignItems="center" justifyContent="center" height="70vh" >
          <Box display="inline-block" textAlign="center">
            <SentimentDissatisfied />
            <Typography variant="body1">No products found</Typography>
          </Box>
        </Box>
      );
    }
  
    return productList.map((product) => (
      <Grid item xs={6} md={3} key={product._id}>
        <ProductCard product={product} handleAddToCart={addToCart} />
      </Grid>
    ));
  };
  
  const DisplayProductGrid = () => (
    <Grid container spacing={2}>
      <Grid item className="product-grid">
        <Box className="hero">
          <p className="hero-heading">
            India’s <span className="hero-highlight">FASTEST DELIVERY</span> to
            your doorstep
          </p>
        </Box>
      </Grid>
      <DisplayProducts />
    </Grid>
  );
  

  const DisplaySearchBox = (className) => (
    <TextField
      className={className}
      size="small"
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search color="primary" />
          </InputAdornment>
        ),
      }}
      placeholder="Search for items/categories"
      name="search"
      onChange={ (e) => { debouncedSearchInbox( e.target.value, 500 )} }
    />
  );

  return (
    <div>
      <Header children={DisplaySearchBox("search-desktop")} hasHiddenAuthButtons={true} />
      {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      {/* Search view for mobiles */}
      {DisplaySearchBox("search-mobile")}

      <Grid container spacing={2}>
        { localStorage.getItem("token")
          ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={9}>
                <DisplayProductGrid />
              </Grid>
              <Grid item xs={12} md={3}>
                <Cart
                  products={allProductList}
                  items={itemList}
                  handleQuantity={addToCart}
                />
              </Grid>
            </Grid>
          )
          : <DisplayProductGrid />
        }
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
