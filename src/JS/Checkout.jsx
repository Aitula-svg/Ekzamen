import { useDispatch, useSelector } from "react-redux";
import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { useEffect, useState } from "react";
import { fetchProducts } from "../thunks/productAthynkThunk";
import { decrementQuantity, incrementQuantity } from "../slices/productSlice";
import styled from "styled-components";

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity,
  total,
}) => {
  const dispatch = useDispatch();

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>${total}</td>
      <td>
        <StyleButton
          className={styles.actionButton}
          onClick={() => dispatch(incrementQuantity(id))}
        >
          +
        </StyleButton>
        <StyleButton
          className={styles.actionButton}
          onClick={() => dispatch(decrementQuantity(id))}
        >
          -
        </StyleButton>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchProducts());

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const totalSum = products.reduce((sum, product) => sum + product.total, 0);
  const discount = totalSum > 100 ? totalSum * 0.1 : 0;
  const finalTotal = totalSum - discount;

  if (status === "loading" || loading) {
    return <LoadingIcon />;
  }

  if (status === "failed") {
    return <h4 style={{ color: "red" }}>Something went wrong</h4>;
  }

  return (
    <div>
      <header className={styles.header}>
        <h1>Electro World</h1>
      </header>
      <main>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <Product key={item.id} {...item} />
            ))}
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>Discount: ${discount.toFixed(2)} </p>
        <p>Total: $ {finalTotal.toFixed(2)}</p>
      </main>
    </div>
  );
};

export default Checkout;

const StyleButton = styled.button`
  cursor: pointer;
`;
