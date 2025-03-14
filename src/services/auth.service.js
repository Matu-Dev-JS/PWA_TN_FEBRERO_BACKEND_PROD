import ENVIROMENT from "../config/enviroment.config.js"
import userRepository from "../repositories/user.repository.js"
import { AUTHORIZATION_TOKEN_PROPS } from "../utils/constants/token.constants.js"
import { ServerError } from "../utils/errors.utils.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

/* 
La responsabilidad de la capa services es la de manejar la logica de negocio de nuestra aplicacion
*/
class AuthService {
    
    async login (email, password){
        const user_found = await userRepository.findUserByEmail(email)
        if(!user_found){
            throw new ServerError('User not found', 404)
        }
        if(!user_found.verified){
            throw new ServerError('User found has no validated his email', 400)
        }
        const isSamePassword = await bcrypt.compare(password, user_found.password)
        if(!isSamePassword){
            throw new ServerError('The password is not correct', 400)
        }
        const authorization_token = jwt.sign(
            {
                [AUTHORIZATION_TOKEN_PROPS.ID]: user_found._id,
                username: user_found.username,
                email: user_found.email
            },
            ENVIROMENT.SECRET_KEY_JWT,
            {expiresIn: '2h'}
        )
        return authorization_token
    }
    
    async verifyUserByEmail (email, verification_token){
        const user_found = await userRepository.findUserByEmail(email)
        
        if(!user_found){
            throw new ServerError('User not found', 404)
        }

        if(user_found.verified){
            throw new ServerError('User has already been verified', 400)
        }

        if(user_found.verification_token !== verification_token){
            throw new ServerError('Invalid verification token', 400)
        }
        //Reenviar el mail de verificacion
        await userRepository.verifyUserByEmail(email, verification_token)
    }
}

const authService = new AuthService()
export default authService