import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Colors, ColorsProp, ThemeNames, ThemeSchema } from '@/components/skysolo-ui/colors'


export type ThemeState = {
  themeSchema: ThemeSchema | null,
  themeName: ThemeNames | null,
  themeLoaded?: boolean,
  currentTheme: ColorsProp | null
  // onlineThemes: Themes[]
}


const initialState: ThemeState = {
  themeSchema: null,
  themeLoaded: false,
  currentTheme: null,
  themeName: null,
}

export const ThemeSlice = createSlice({
  name: 'Theme',
  initialState,
  reducers: {
    changeColorSchema: (state, { payload }: PayloadAction<ThemeSchema>) => {
      if (!state.themeName) return state
      state.currentTheme = Colors[state.themeName][payload]
      state.themeSchema = payload
    },
    changeTheme: (state, { payload }: PayloadAction<ThemeNames>) => {
      // console.log("Changing Theme", state.themeSchema)
      if (!state.themeSchema) return state
      state.currentTheme = Colors[payload][state.themeSchema]
      state.themeName = payload
    },
    setThemeLoaded: (state, { payload: { userColorScheme, userThemeName } }: PayloadAction<{
      userColorScheme: ThemeSchema,
      userThemeName: ThemeNames
    }>) => {
      // console.log("Setting Theme", userColorScheme, userThemeName)
      state.currentTheme = Colors[userThemeName][userColorScheme]
      state.themeSchema = userColorScheme
      state.themeName = userThemeName
      state.themeLoaded = true
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  changeTheme,
  setThemeLoaded,
  changeColorSchema
} = ThemeSlice.actions

export default ThemeSlice.reducer