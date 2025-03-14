import promisePool from "../config/mysql.config.js";
import Workspace from "../models/Workspace.model.js";
import { ServerError } from "../utils/errors.utils.js";

class WorkspaceRepository {
    /* async findWorkspaceById (id){
        console.log(id)
        return await Workspace.findById(id)

    } */

    async findWorkspaceById(id){
        const queryStr = `SELECT * FROM workspaces WHERE _id = ?`
        const [result] = await promisePool.execute(queryStr, [id])
        return result[0]
    }
    /* async createWorkspace({name, owner_id}){
        const workspace = await Workspace.create(
            {
                name, 
                owner: owner_id,
                members: [owner_id] 
            }
        )
        return workspace
    }
 */
    /* async createWorkspace({name, owner_id}){
       //INSERT DEL NUEVO WORKSPACE A LA TABLA DE WORKSPACES
        const [result] = await promisePool.execute()
        const workspace_id = result.insertId
        this.addMember(workspace_id, owner_id)
    } */

    
    async createWorkspace({name, owner_id}){
        let queryStr = `INSERT INTO workspaces (name, owner) VALUES (?,?)`

        const [result] = await promisePool.execute(queryStr, [name, owner_id])
        //El id del registro insertado
        const workspace_id = result.insertId
        
        return {workspace_id, owner: owner_id, members: [owner_id]} //devuelve el id del workspace creado
    }
   
   

    async addMember(workspace_id, member_id){
        //INSERT DEL MIEMBRO (EL DUEÑO DEL WORKSPACE) A LA TABLA DE WORKSPACE_MEMBERS
        let queryStr = `INSERT INTO workspace_members (workspace_id, user_id) VALUES (?,?)`
        await promisePool.execute(queryStr, [workspace_id, member_id])
    }


    /* async addNewMember({workspace_id, owner_id, invited_id}){
        const workspace_found = await this.findWorkspaceById(workspace_id)

        //Que exista el workspace
        if(!workspace_found){
            throw new ServerError('Workspace not found', 404)
        }

        //Que sea el dueño

        if(!workspace_found.owner.equals(owner_id)){
            throw new ServerError('You are not the owner of this workspace', 403)
        }

        //Que el invitado ya no sea miembro del workspace
        if(workspace_found.members.includes(invited_id)){
            throw new ServerError('Is already a member', 400)
        }

        workspace_found.members.push(invited_id)
        await workspace_found.save()
        return workspace_found
    } */

    async isUserMemberOfWorkspace({workspace_id, user_id}){
        const queryStr = `
        SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?
        `
        const [result] = await promisePool.execute(queryStr, [workspace_id, user_id])

        return result.length > 0
    }
}

const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository