import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "../thunks/productAthynkThunk";

export const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    status: "idle",
    error: null,
  },
  reducers: {
    incrementQuantity: (state, action) => {
      const product = state.products.find((item) => item.id === action.payload);
      if (product && product.availableCount > product.orderedQuantity) {
        product.orderedQuantity += 1;
        product.total = product.orderedQuantity * product.price;
      }
    },
    decrementQuantity: (state, action) => {
      const product = state.products.find((item) => item.id === action.payload);
      if (product && product.orderedQuantity > 0) {
        product.orderedQuantity -= 1;
        product.total = product.orderedQuantity * product.price;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.map((item) => ({
          ...item,
          orderedQuantity: 0,
          total: 0,
        }));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { incrementQuantity,decrementQuantity } = productSlice.actions;

export default productSlice.reducer;
