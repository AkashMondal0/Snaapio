import { createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PayloadAction } from '@reduxjs/toolkit'


export interface Notification_State {
  currentNotification: any;
}

const initialState: Notification_State = {
  currentNotification: [
    
  ],
}

export const Notification_Slice = createSlice({
  name: 'Notification',
  initialState,
  reducers: {
    currentNotification: (state, action: PayloadAction<any>) => {
      AsyncStorage.setItem('currentTheme', JSON.stringify(action.payload));
      // state.currentTheme = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  currentNotification,
} = Notification_Slice.actions

export default Notification_Slice.reducer