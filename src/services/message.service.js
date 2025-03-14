import channelRepository from "../repositories/channel.repository.js"
import messageRepository from "../repositories/message.repository.js"
import workspaceRepository from "../repositories/workspace.repository.js"
import { ServerError } from "../utils/errors.utils.js"

class MessageService {
    async create(channel_id, user_id, content) {
        const channel_found = await channelRepository.findChannelById(channel_id)
        if(!channel_found){
            throw new ServerError('Channel not found', 404)
        }   
        if(!workspaceRepository.isUserMemberOfWorkspace({workspace_id: channel_found.workspace, user_id})){
            throw new ServerError('User is not member of this workspace', 403)
        }
        const new_message = await messageRepository.create({sender_id: user_id, channel_id, content})
        return new_message
    }
    async getMessagesFromChannel(){

    }
}

const messageService = new MessageService()
export default messageService