import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

const auth = async(req, res, next) =>{
    const {authorization} = req.headers;

    if(!authorization){
        return res.status(404).send("Authorization token not found");
    }

    
    const token = authorization.split(" ")[1];

    try {
        
        const {_id} = jwt.verify(token, process.env.SECRET_WEB_KEY);
        req.user = await User.findById(_id).select("_id");

        next();

    } catch (e) {
        console.log(e);
        return res.status(404).send({error: e.message})
    }
}

export default auth;