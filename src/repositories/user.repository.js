import promisePool from "../config/mysql.config.js";
import User, { USER_PROPS } from "../models/User.model.js";
import { ServerError } from "../utils/errors.utils.js";

class UserRepository {
   /*  async create({
        username, 
        email, 
        password, 
        verification_token
    }){
        try{
            await User.create({
                [USER_PROPS.USERNAME]: username, 
                [USER_PROPS.EMAIL]: email, 
                [USER_PROPS.PASSWORD]: password, 
                [USER_PROPS.VERIFICATION_TOKEN]:verification_token
            })
        }
        catch(error){
            
            if(error.code === 11000){
                if(error.keyPattern.username){
                    throw new ServerError("Username already registered", 400)
                }
                if(error.keyPattern.email){
                    
                    throw new ServerError("Email already registered", 400)
                }
            }
            console.log('Error al crear el usuario', error)
            
            throw error
        }
    } */
        async create({
            username, //OR 1 = 1 DROP TABLE users
            email, 
            password, 
            verification_token
        }){
            try{
                //Inyeccion sql
                let queryStr = `
                INSERT INTO users (username, email, password, verification_token)
                VALUES (?, ?, ?, ?)
                `

                const [result] = await promisePool.execute(
                    queryStr, 
                    [
                        username, 
                        email, 
                        password, 
                        verification_token
                    ] 
                )
                
            }
            catch(error){
                
                if(error.code === 11000){
                    if(error.keyPattern.username){
                        throw new ServerError("Username already registered", 400)
                    }
                    if(error.keyPattern.email){
                        
                        throw new ServerError("Email already registered", 400)
                    }
                }
                console.log('Error al crear el usuario', error)
                
                throw error
            }
        }
    

    /* async verifyUserByEmail (email, verification_token){
        const user_found = await User.findOne({[USER_PROPS.EMAIL]: email})
       
        if(!user_found){
            throw new ServerError('User not found', 404)
        }

        if(user_found.verified){
            throw new ServerError('User has already been verified', 400)
        }

        if(user_found.verification_token !== verification_token){
            throw new ServerError('Invalid verification token', 400)
        }
        user_found.verified = true
        await user_found.save()
        return user_found
    } */

    async verifyUserByEmail (email, verification_token){
        const user_found = await this.findUserByEmail(email)
        
        if(!user_found){
            throw new ServerError('User not found', 404)
        }

        if(user_found.verified){
            throw new ServerError('User has already been verified', 400)
        }

        if(user_found.verification_token !== verification_token){
            throw new ServerError('Invalid verification token', 400)
        }
        
        const queryStr = `UPDATE users SET verified = 1 WHERE email = ? AND verification_token = ?`

        await promisePool.execute(queryStr, [email, verification_token])

        return user_found
    }

    /* async findUserByEmail (email){
        return await User.findOne({[USER_PROPS.EMAIL]: email})
    } */

    async findUserByEmail (email){
        const queryStr = `SELECT * FROM users WHERE email = ?`
        const [result] = await promisePool.execute(queryStr, [email])

        return result[0] || null
    }

    //TAREA
    async changeUserPassword(id, newPassword) {
        const foundUser = await User.findById(id)
        if(!foundUser) {
            throw new ServerError('User not found', 404)
        }
        foundUser.password = newPassword
        await foundUser.save()
    }

}

const userRepository = new UserRepository()

export default userRepository


