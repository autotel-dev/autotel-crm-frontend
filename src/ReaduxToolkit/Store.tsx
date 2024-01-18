import { configureStore } from "@reduxjs/toolkit";
import LayoutSlice from "./Reducer/LayoutSlice";
import BookmarkTabSlice from "./Reducer/BookmarkTabSlice";
import ThemeCustomizerSlice from "./Reducer/ThemeCustomizerSlice";
import FilterSlice from "./Reducer/FilterSlice";
import ProductSlice from "./Reducer/ProductSlice";
import CartSlice from "./Reducer/CartSlice";
import ProjectSlice from "./Reducer/ProjectSlice";
import TasksSlice from "./Reducer/TasksSlice";
import ChatSlice from "./Reducer/ChatSlice";
import ContactSlice from "./Reducer/ContactSlice";
import BookmarkSlice from "./Reducer/BookmarkSlice";
import ToDoSlice from "./Reducer/ToDoSlice";
import CitiesSlice from "./Reducer/CitiesSlice";
import ProvinceSlice from "./Reducer/ProvinceSlice";
import PackageSlice from "./Reducer/PackageSlice";
import CountrySlice from "./Reducer/CountrySlice";
import CRMModuleSlice from "./Reducer/CRMModuleSlice";
import NoDataFoundSlice from "./Reducer/NoDataFoundSlice";
import CompanySlice from "./Reducer/CompanySlice";

const Store = configureStore({
  reducer: {
    layout: LayoutSlice,
    bookmarkTab: BookmarkTabSlice,
    themeCustomizer: ThemeCustomizerSlice,
    filterData: FilterSlice,
    product: ProductSlice,
    cartData: CartSlice,
    todo: ToDoSlice,
    project: ProjectSlice,
    tasks: TasksSlice,
    chatData: ChatSlice,
    contact: ContactSlice,
    bookmark: BookmarkSlice,
    cities: CitiesSlice,
    provinces: ProvinceSlice,
    packages: PackageSlice,
    countries: CountrySlice,
    crmModules: CRMModuleSlice,
    noDataFound: NoDataFoundSlice,
    companies: CompanySlice,
  },
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
