import openai from '../openai';
import MessageModel, { IMessage } from './models/message';
import { AddMessageDto } from './dtos/AddMessageDto.dot';

class RoadmapService {
  async addMessage(addMessageDto: AddMessageDto): Promise<IMessage> {
    const { message } = addMessageDto;
    // console.log(message);
    const newMessage = new MessageModel({
      message
    });

    await newMessage.save();
    return newMessage;
  }
  async getMessages(): Promise<(IMessage)[]> {
    return MessageModel.find();
  }
  async create(userPrompt: string, callback: (data: any) => void) {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `
          You are an assistant. 
          `,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      stream: true,
    });
    try {
      let gptResponse = "Assistant: ";
      for await (const chunk of stream) {
        if (chunk.choices && chunk.choices.length > 0 && chunk.choices[0].delta && chunk.choices[0].delta.content) {
          // Check if content is not an empty object
          const content = chunk.choices[0].delta.content;
          if (Object.keys(content).length !== 0) {  // This checks if content is non-empty
            gptResponse += content;
            callback(content);
          }
        }
      }

      await this.addMessage({
        message: gptResponse,
      });
    } catch (error) {
      console.error('Error processing OpenAI stream', error);
      throw new Error('Failed to process OpenAI stream');
    }
  }
}

export default RoadmapService;
