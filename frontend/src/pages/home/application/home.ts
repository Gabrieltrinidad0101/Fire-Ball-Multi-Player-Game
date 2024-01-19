import APIURL from "../../../share/application/Api";
import ICustomFecth from "../../../share/domian/customFecth";
import IUser from "../../../share/domian/user";

export class HomeApp{
    constructor(private readonly customFetch: ICustomFecth){}
    getPlayer = async (): Promise<Array<IUser>> =>{
        const response = await this.customFetch.get<Array<IUser>>(APIURL.findAllPlayer)
        return response?.message ?? []
    }

    getActiveGame(){
        
    }
}