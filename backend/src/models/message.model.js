import mongoose, { Schema } from 'mongoose';
const messageSchema = new Schema(
    {
        Receiver: {
            type: Schema.Types.ObjectId,
            ref: 'Chat'
        }, Sender: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }, Content: {
            type: String,
            required: true
        }, Attachments: {
            type: String,
            required: false
        }
    }, {
    timestamps: true
}
)
export const Message = mongoose.model('Message', messageSchema)