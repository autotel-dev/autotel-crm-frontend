import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: [],
  productType: [],
  units: [],
  filterProduct: [],
  activeInActiveProduct: "All",
  productTypeId: null,
  unitsId: null,
  loading: false,
  error: null,
  id: null,
  value: "",
  noProductFound: "",
  productTypeName: "",
  unitsName: "",
  isConnected: true,
};

const InventoryProductSlice = createSlice({
  name: "InventoryProductSlice",
  initialState,
  reducers: {
    setProductStart: (state) => {
      state.loading = true;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
      state.error = null;
      // state.loading = false;
    },
    setFilterProduct: (state, action) => {
      state.filterProduct = action.payload;
      state.error = null;
      // state.loading = false;
    },
    setInActiveActiveProduct: (state, action) => {
      state.activeInActiveProduct = action.payload;
    },
    setProductEnd: (state) => {
      state.loading = false;
    },
    setProductType: (state, action) => {
      state.productType = action.payload;
      state.error = null;
      state.loading = false;
    },
    setUnits: (state, action) => {
      state.units = action.payload;
      state.error = null;
      state.loading = false;
    },

    setProductTypeId: (state, action) => {
      state.productTypeId = action.payload;
    },
    setUnitsId: (state, action) => {
      state.unitsId = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoProductFound: (state, action) => {
      state.noProductFound = action.payload;
    },
    setProductTypeName: (state, action) => {
      state.productTypeName = action.payload;
    },
    setUnitsName: (state, action) => {
      state.unitsName = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setProductStart,
  setProduct,
  setFilterProduct,
  setInActiveActiveProduct,
  setProductEnd,
  setProductType,
  setUnits,
  setProductTypeId,
  setUnitsId,
  setNoProductFound,
  setId,
  setValue,
  setProductTypeName,
  setUnitsName,
  setIsConnected
} = InventoryProductSlice.actions;

export default InventoryProductSlice.reducer;
