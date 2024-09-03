import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: String, required: true })
  createdAt: string;

  @Prop({ type: String })
  updatedAt: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);