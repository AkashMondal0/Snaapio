import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Colors, ColorsProp, ThemeNames, ThemeSchema } from '@/components/skysolo-ui/colors'


export type ThemeState = {
  themeSchema: ThemeSchema | null,
  themeName: ThemeNames | null,
  themeLoaded?: boolean,
  currentTheme: ColorsProp | null
  appRadius: number,
  appIconSize: number,
  tabSwiped: boolean,
  themeColors: {
    name: string,
    light: ColorsProp,
    dark: ColorsProp
  }[]
}


const initialState: ThemeState = {
  themeSchema: null,
  tabSwiped: true,
  themeLoaded: false,
  currentTheme: null,
  appRadius: 20,
  appIconSize: 32,
  themeName: null,
  themeColors: [],
}

export const ThemeSlice = createSlice({
  name: 'Theme',
  initialState,
  reducers: {
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
    changeTabSwiped: (state, { payload }: PayloadAction<boolean>) => {
      state.tabSwiped = payload
    }
  },

})

export const {
  changeTheme,
  setThemeLoaded,
  changeColorSchema,
  changeTabSwiped
} = ThemeSlice.actions

export default ThemeSlice.reducer