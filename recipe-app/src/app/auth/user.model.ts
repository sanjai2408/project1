//stores all the core data that makes up a user
//validates if a token is still working or expired

export class User{
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date
    ){}

    //getting access to the token where the validity automatically gets checked
    get token(){
        //check to see if expiration date exists or if current date is past exipiration date
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
            return null;
        }
        return this._token;
    }

}