import RoadmapService from './roadmap.service';
import { AddMessageDto } from './dtos/AddMessageDto.dot';
import { Request, Response } from 'express';
class roadmapController {
  private roadmapService: RoadmapService;

  constructor(roadmapService: RoadmapService) {
    this.roadmapService = roadmapService;
  }

  async handleWebSocketConnection(ws: WebSocket, userPrompt: string) {
    try {
      await this.roadmapService.create(userPrompt, (data) => {
        ws.send(data);
      });
    } catch (error) {
      ws.send(JSON.stringify({ error: 'Failed to process OpenAI stream' }));
    }
  }

  addMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const addMessageDto: AddMessageDto = req.body;
      // console.log("lol");
      const message = await this.roadmapService.addMessage(addMessageDto);
      
      res.status(201).json(message);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  getMessages = async (req:Request, res:Response) =>{
    try{
        const messages = await this.roadmapService.getMessages();
        res.status(200).json(messages);
    }catch (error: any) {
        res.status(500).json({ error: error.message });
      }
}

}

export default roadmapController;
