import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Colors, ColorsProp, ThemeNames, ThemeSchema } from '@/components/skysolo-ui/colors'


export type ThemeState = {
  themeSchema: ThemeSchema | null,
  themeName: ThemeNames | null,
  themeLoaded?: boolean,
  currentTheme: ColorsProp | null
  tabIndex: number
  tabSwipeEnabled: boolean
  appRadius: number,
  appIconSize: number,
  themeColors: {
    name: string,
    light: ColorsProp,
    dark: ColorsProp
  }[]
}


const initialState: ThemeState = {
  themeSchema: null,
  themeLoaded: false,
  currentTheme: null,
  appRadius: 20,
  appIconSize: 32,
  themeName: null,
  themeColors: [],
  tabIndex: 1,
  tabSwipeEnabled: true
}

export const ThemeSlice = createSlice({
  name: 'Theme',
  initialState,
  reducers: {
    tabSwipeEnabled: (state, { payload }: PayloadAction<boolean>) => {
      state.tabSwipeEnabled = payload
    },
    changeColorSchema: (state, { payload }: PayloadAction<ThemeSchema>) => {
      if (!state.themeName) return state
      state.currentTheme = Colors.find((color) => color.name === state.themeName)?.[payload] || null
      state.themeSchema = payload
    },
    changeTheme: (state, { payload }: PayloadAction<ThemeNames>) => {
      if (!state.themeSchema) return state
      const index = Colors.findIndex((color) => color.name === payload)
      if (index === -1) return state
      state.currentTheme = Colors[index][state.themeSchema]
      state.themeName = payload
    },
    setThemeLoaded: (state, { payload: { userColorScheme, userThemeName } }: PayloadAction<{
      userColorScheme: ThemeSchema,
      userThemeName: ThemeNames
    }>) => {
      if (!userColorScheme || !userThemeName) return state
      const index = Colors.findIndex((color) => color.name === userThemeName)
      if (index === -1) return state
      state.themeColors = Colors
      state.themeSchema = userColorScheme
      state.themeName = userThemeName
      state.themeLoaded = true
      state.currentTheme = Colors[index][userColorScheme]
    },
    tabChange: (state, { payload }: PayloadAction<number>) => {
      state.tabIndex = payload
    }
  },

})

// Action creators are generated for each case reducer function
export const {
  changeTheme,
  setThemeLoaded,
  changeColorSchema,
  tabChange,
  tabSwipeEnabled
} = ThemeSlice.actions

export default ThemeSlice.reducer