import { AddShoppingCartOutlined } from "@mui/icons-material"; // eslint-disable-line
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
       <CardMedia
        component="img"
        image={product.image}
        alt="img"
      />
      <CardContent>
        <Typography color="text.primary" gutterBottom>
          {product.name}
        </Typography>
        <Typography gutterBottom variant="h5">
          {product.category}
        </Typography>
        <Typography color="text.secondary">${product.cost}</Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions>
        <Button variant="contained" 
          onClick={ () => handleAddToCart( product._id, 1, { preventDuplicate: true } ) }
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
