  export interface Login{
    tenancyName: string;
    userNameOrEmailAddress: string;
    password: string;
    rememberClient:boolean;
  } 
  export interface User {
    access_token: string;
    expires: string;
    refresh_token: string;
    fullName: string;
    username: string;
    unitId: string;
    UnitCode: string;
    idTaiKhoan: number;
    anhdaidien: string;
    isAdministrator: boolean;
    lstRoles: string[];
  }