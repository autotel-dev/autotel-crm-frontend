import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    createCompany: {},
    saleLeads: [],
    customers: [],
    customer: null,
    saleLead: null,
    invoiceData: null,
    cities: [],
    packages: [],
    banks: [],
    insurances: [],
    groups: [],
    vehicleMakes: [],
    vehicleModels: [],
    services: [],
    devices: [],
    sims: [],
    sensors: [],
    accessories: [],
    installedUsers: [],
    servers: [],
    fuelTypes: [
        {
            label: "Petrol",
            value: "PETROL",
        },
        {
            label: "Diesel",
            value: "DIESEL",
        },
        {
            label: "CNG/LPG",
            value: "CNG_OR_LPG",
        },
    ],
    transmissions: [
        {
            label: "Automatic",
            value: "AUTOMATIC",
        },
        {
            label: "Manual",
            value: "MANUAL",
        },

    ],
    saleLeadId: "",
    loading: false,
    error: null,
    isConnected: true,
};

const SalesSlice = createSlice({
    name: "SalesSlice",
    initialState,
    reducers: {
        // setCreateCompany: (state, action) => {
        //     state.createCompany = action.payload;
        // },
        setSaleLeadsStart: (state) => {
            state.loading = true;
        },
        setSaleLeads: (state, action) => {
            state.saleLeads = action.payload;
            state.error = null;
            state.loading = false;
        },
        setCustomers: (state, action) => {
            state.customers = action.payload;
            state.error = null;
            state.loading = false;
        },
        setCustomer: (state, action) => {
            state.customer = action.payload;
        },

        setSaleLead: (state, action) => {
            state.saleLead = action.payload;
        },

        setSaleLeadsEnd: (state) => {
            state.loading = false;
        },
        setInvoiceData: (state, action) => {
            state.invoiceData = action.payload;
        },

        setSaleLeadId: (state, action) => {
            state.saleLeadId = action.payload;
        },
        setCities: (state, action) => {
            state.cities = action.payload;
        },

        setPackages: (state, action) => {
            state.packages = action.payload;
        },
        setBanks: (state, action) => {
            state.banks = action.payload;
        },
        setInsurances: (state, action) => {
            state.insurances = action.payload;
        },
        setGroups: (state, action) => {
            state.groups = action.payload;
        },
        setVehicleMakes: (state, action) => {
            state.vehicleMakes = action.payload;
        },
        setVehicleModels: (state, action) => {
            state.vehicleModels = action.payload;
        },
        setServices: (state, action) => {
            state.services = action.payload;
        },
        setInstalledUser: (state, action) => {
            state.installedUsers = action.payload;
        },
        setServers: (state, action) => {
            state.servers = action.payload;
        },
        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const {
    setSaleLeads,
    setCustomers,
    setCustomer,
    setSaleLead,
    setInvoiceData,
    setCities,
    setPackages,
    setBanks,
    setInsurances,
    setGroups,
    setVehicleMakes,
    setVehicleModels,
    setServices,
    setInstalledUser,
    setServers,
    setSaleLeadId,
    setIsConnected,
} = SalesSlice.actions;

export default SalesSlice.reducer;
