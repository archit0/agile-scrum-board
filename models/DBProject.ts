/**
 * Created by archit on 9/4/17.
 */
export class DBProject{
    public _id:string;
    public projectName:string;
    public description:string;
    public createdOn:string;
    public createdByUserId:string;
    public users:Array<string>;
}

