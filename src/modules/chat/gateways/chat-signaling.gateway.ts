import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { ChatRepository } from '@modules/chat/repositories/chat.repository';
import { ChatSignalEventEnum } from '@modules/chat/enums/chat-signal-event.enum';
import { SdpEventDto } from '@modules/chat/dtos/sdp-event.dto';
import { JoinChatEventDto } from '@modules/chat/dtos/join-chat-event.dto';
import { LeaveChatEventDto } from '@modules/chat/dtos/leave-chat-event.dto';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatSignalingGateway {
  @WebSocketServer() server: Server;

  @Inject() private readonly chatRepository: ChatRepository;

  private readonly sessions = new Map<string, Set<string>>();
  private readonly sessionToSocketMap = new Map<string, string>();

  @SubscribeMessage(ChatSignalEventEnum.SDP_EVENT)
  handleSDPEvent(@MessageBody() data: SdpEventDto): void {
    const { senderId, recipientId, type, sdp } = data;

    const recipientSocketId = this.sessionToSocketMap.get(recipientId);

    this.server.to(recipientSocketId).emit(ChatSignalEventEnum.SDP_EVENT, {
      senderId,
      type,
      sdp,
    });
  }

  @SubscribeMessage(ChatSignalEventEnum.JOIN_CHAT)
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() { userId, chatId }: JoinChatEventDto,
  ) {
    const session = await this.chatRepository.createSession({ userId, chatId });

    if (!this.sessions.has(chatId)) {
      this.sessions.set(chatId, new Set());
    }

    this.sessions.get(chatId).add(session.id);

    this.sessionToSocketMap.set(session.id, client.id);

    client.to(chatId).emit(ChatSignalEventEnum.CONNECTION_EVENT, {
      message: 'User joined chat',
      sessionId: session.id,
      chatId,
    });

    client.join(chatId);

    client.emit(ChatSignalEventEnum.JOIN_SUCCESS, session);
  }

  @SubscribeMessage(ChatSignalEventEnum.JOIN_EVENT)
  async handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() { chatId }: LeaveChatEventDto,
  ) {
    if (this.sessions.get(chatId).size === 0) {
      this.sessions.delete(chatId);
    }
    const sessionId = [...this.sessionToSocketMap.entries()]
      .find(([, socketId]) => socketId === client.id)?.[0];

    await this.chatRepository.dropSession(sessionId);

    if (sessionId) {
      this.sessionToSocketMap.delete(sessionId);

      for (const [id, sessions] of this.sessions.entries()) {
        if (sessions.delete(sessionId) && sessions.size === 0) {
          this.sessions.delete(id);
        }
      }
    }

    client.to(chatId).emit(ChatSignalEventEnum.LEAVE_EVENT, {
      message: 'User left chat',
      sessionId: sessionId,
      chatId,
    });
  }
}
