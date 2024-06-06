import { configureStore, createSlice } from '@reduxjs/toolkit';
const Chat = {
    userId: '',
    friendId: '',
    view: 0,
}
const newSlice = createSlice({
    name: 'new',
    initialState: { Chat: Chat },
    reducers: {
        changeFriend(state, action) {
            state.Chat.friendId = action.payload.Id
        }, setUser(state, action) {
            state.Chat.userId = action.payload.Id
        }
    }
})
export const authActions = newSlice.actions;
export const Store = configureStore({
    reducer: newSlice.reducer
})