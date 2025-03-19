import workspaceRepository from "../repositories/workspace.repository.js";
import { ServerError } from "../utils/errors.utils.js";

class WorkspaceService {
    async createWorkspace({name, owner_id}){
        const workspace_created = await workspaceRepository.createWorkspace({name, owner_id})
        await workspaceRepository.addMember(workspace_created.workspace_id, owner_id)

        return workspace_created
    }

    /*
    Service: addMember() 
    Checkea que exista el workspace, que el dueño sea el que esta intentando agregar un nuevo miembro y que el nuevo miembro no sea ya miembro del workspace

    Repository: async isUserMemberOfWorkspace(workspace_id, user_id){}
    Selecciona de la tabla workspace_members al workspace_id y al user_id pasados por parametro y devuelve el resultado
    Si el array de resultados es mayor a 0, devuelve true, sino false
    */
    async addMember(workspace_id, member_id, owner_id){

        const workspace_found = await  workspaceRepository.findWorkspaceById(workspace_id)

        if(!workspace_found){
            throw new ServerError("Workspace not found", 404)
        }
        const is_member = await workspaceRepository.isUserMemberOfWorkspace({workspace_id, user_id:member_id}) 

        if(is_member){
            throw new ServerError("User already member of this workspace", 400)
        }
        if(workspace_found.owner !== owner_id){
            throw new ServerError("You are not the owner of this workspace", 403)
        }
    

        //Si todo esta bien
        await workspaceRepository.addMember(workspace_id, member_id)

        return workspace_found
    }
}

const workspaceService = new WorkspaceService()
export default workspaceService