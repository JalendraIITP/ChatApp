import mongoose, { Schema } from 'mongoose';
const chatSchema = new Schema(
    {
        Creator: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }, Friend: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {
    timestamps: true
}
)
export const Chat = mongoose.model('Chat', chatSchema)