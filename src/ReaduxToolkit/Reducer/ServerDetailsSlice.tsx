import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createServer: {},
  serverInfo: {},
  serverCredentials: {},
  googleAccountCreadentials: {},
  firebaseAccountCredentials: {},
  apiKeys: "",
  servers: [],
  filterServers: [],
  server: {},
  loading: false,
  error: null,
  id: null,
  noDataFound: "",
};

const ServerDetailsSlice = createSlice({
  name: "ServerDetailsSlice",
  initialState,
  reducers: {
    setCreateServer: (state, action) => {
      state.createServer = action.payload;
    },
    setServerInfo: (state, action) => {
      state.serverInfo = action.payload;
    },
    setServerCredentials: (state, action) => {
      state.serverCredentials = action.payload;
    },
    setGoogleAccountCreadentials: (state, action) => {
      state.googleAccountCreadentials = action.payload;
    },
    setFirebaseAccountCredentials: (state, action) => {
      state.firebaseAccountCredentials = action.payload;
    },
    setApiKeys: (state, action) => {
      state.apiKeys = action.payload;
    },

    setServersStart: (state) => {
      state.loading = true;
    },
    setServers: (state, action) => {
      state.servers = action.payload;
      state.error = null;
      state.loading = false;
    },
    setServersEnd: (state) => {
      state.loading = false;
    },
    setFilterServers: (state, action) => {
      state.filterServers = action.payload;
      state.error = null;
      state.loading = false;
    },
    setServer: (state, action) => {
      state.server = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setNoDataFound: (state, action) => {
      state.noDataFound = action.payload;
    },
  },
});
export const {
  setCreateServer,
  setServersStart,
  setServers,
  setServersEnd,
  setFilterServers,
  setServer,
  setId,
  setServerInfo,
  setServerCredentials,
  setGoogleAccountCreadentials,
  setFirebaseAccountCredentials,
  setApiKeys,
  setNoDataFound,
} = ServerDetailsSlice.actions;

export default ServerDetailsSlice.reducer;
