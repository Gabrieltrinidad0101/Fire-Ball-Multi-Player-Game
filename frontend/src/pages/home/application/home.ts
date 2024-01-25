import APIURL from "../../../share/application/Api";
import { isNullEmptyUndefinedOrNan } from "../../../share/application/isNullEmptyUndifinedOrNan";
import ICustomFecth from "../../../share/domian/customFecth";
import IGame from "../../../share/domian/game";
import IUser from "../../../share/domian/user";

export class HomeApp{
    constructor(private readonly customFetch: ICustomFecth){}
    
    getPlayers = async (): Promise<Array<IUser>> =>{
        const response = await this.customFetch.get<Array<IUser>>("user", APIURL.findAllPlayers)
        return response?.message ?? []
    }

    getGames = async (): Promise<Array<IGame>>=>{
        const response = await this.customFetch.get<Array<IGame>>("game",APIURL.findAllGames)
        return response?.message ?? []
    }

    newGame = async (redirect: (gameUUid: string)=>void): Promise<void>=>{
        const response = await this.customFetch.post<IGame>("game",APIURL.newGame,{})
        if (response?.message == undefined || isNullEmptyUndefinedOrNan(response?.message)){
            return         
        }
        redirect(response.message.uuid)
    }

    
}