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
        const isUserMember = await workspaceRepository.isUserMemberOfWorkspace({user_id, workspace_id: channel_found.workspace})
        if(!isUserMember){
            throw new ServerError('User is not member of this workspace', 403)
        }
        const new_message = await messageRepository.create({sender_id: user_id, channel_id, content})
        return new_message
    }
    async getMessagesFromChannel({channel_id, user_id}){
        //Buscamos el canal porque tiene workspace que es el workspace_id que necesita isUserMemberOfWorkspace
        const channel_found = await channelRepository.findChannelById(channel_id)
        if(!channel_found){
            throw new ServerError('Channel not found', 404)
        }
        const isUserMember = await workspaceRepository.isUserMemberOfWorkspace({user_id, workspace_id: channel_found.workspace})
        if(!isUserMember){
            throw new ServerError('User is not member of this workspace', 403)
        }

        return await messageRepository.findMessagesFromChannel({channel_id})

    }
}

const messageService = new MessageService()
export default messageService