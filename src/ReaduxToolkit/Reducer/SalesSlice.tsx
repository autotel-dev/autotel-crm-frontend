import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    createCompany: {},
    saleLeads: [],
    customers: [],
    customer: null,
    saleLead: null,
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
    vehicleYears: [
        {
            title: "2011",
            value: "2011",
        },
        {
            title: "2012",
            value: "2012",
        },
        {
            title: "2013",
            value: "2013",
        },
        {
            title: "2014",
            value: "2013",
        }, {
            title: "2015",
            value: "2015",
        },
        {
            title: "2016",
            value: "2016",
        },
        {
            title: "2017",
            value: "2017",
        },
        {
            title: "2018",
            value: "2018",
        }, {
            title: "2019",
            value: "2019",
        },
        {
            title: "2020",
            value: "2020",
        },
        {
            title: "2021",
            value: "2021",
        },
        {
            title: "2022",
            value: "2022",
        },
        {
            title: "2023",
            value: "2023",
        }, {
            title: "2024",
            value: "2024",
        },
        {
            title: "2025",
            value: "2025",
        },
    ],
    fuelTypes: [
        {
            title: "Petrol",
            value: "PETROL",
        },
        {
            title: "Diesel",
            value: "DIESEL",
        },
        {
            title: "CNG/LPG",
            value: "CNG_OR_LPG",
        },
    ],
    transmissions: [
        {
            title: "Automatic",
            value: "AUTOMATIC",
        },
        {
            title: "Manual",
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
