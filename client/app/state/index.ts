import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateTypes {
  isSideBarCollapsed: boolean;
  isModalOpen:boolean;
}

const initialState: InitialStateTypes = {
  isSideBarCollapsed: false,
  isModalOpen:false
};

export const GlobalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSideBarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSideBarCollapsed = action.payload;
    },
    setIsModalCollpased:(state,action:PayloadAction<boolean>)=>{
      state.isSideBarCollapsed=action.payload;
    }
  },
});

export const { setIsSideBarCollapsed,setIsModalCollpased } = GlobalSlice.actions;
export default GlobalSlice.reducer;