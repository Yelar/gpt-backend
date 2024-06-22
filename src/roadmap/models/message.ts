import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    message: string;
}

const messageSchema: Schema = new Schema({

  message: { type: String, required: true}
});

export default mongoose.model<IMessage>('Message', messageSchema);

