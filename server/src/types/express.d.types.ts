import {Auth} from "@clerk/express"
import { User } from "../generated/prisma/client.js";

declare global{
    namespace Express{
        interface Request{
            auth?:Auth;
            dbUser?:User
        }
    }
}