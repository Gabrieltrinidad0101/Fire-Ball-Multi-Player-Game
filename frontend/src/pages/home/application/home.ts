import APIURL from "../../../share/application/Api";
import { isNullEmptyUndefinedOrNan } from "../../../share/application/isNullEmptyUndifinedOrNan";
import ICustomFecth from "../../../share/domian/customFecth";
import IGame from "../../../share/domian/game";
import IUser from "../../../share/domian/player";

export class HomeApp{
    constructor(private readonly customFetch: ICustomFecth){}
    
    getPlayers = async (): Promise<Array<IUser>> =>{
        const response = await this.customFetch.get<Array<IUser>>("player", APIURL.findAllPlayers)
        return response?.message ?? []
    }

    getGames = async (): Promise<Array<IGame>>=>{
        console.log("ok")
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