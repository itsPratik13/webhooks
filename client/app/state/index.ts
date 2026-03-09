import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateTypes {
  isSideBarCollapsed: boolean;
  isModalCollapsed:boolean;
  search:string,
}

const initialState: InitialStateTypes = {
  isSideBarCollapsed: false,
  isModalCollapsed:false,
  search:"",
};

export const GlobalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSideBarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSideBarCollapsed = action.payload;
    },
    setIsModalCollpased:(state,action:PayloadAction<boolean>)=>{
      state.isModalCollapsed=action.payload;
    },
    setSearchValue:(state,action:PayloadAction<string>)=>{
      state.search=action.payload;
    }
  },
});

export const { setIsSideBarCollapsed,setIsModalCollpased,setSearchValue} = GlobalSlice.actions;
export default GlobalSlice.reducer;