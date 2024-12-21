
import  bcrypt  from 'bcrypt';
import { BCRYPT_SALTROUND } from '../constants/env';


const saltRounds:number = BCRYPT_SALTROUND;
export const hashValue = async (value:string, saltRounds?:number)=>
    bcrypt.hash(value,saltRounds ?? 10);

export const compareValue = async (value: string,hashedValue:string)=>
    bcrypt.compare(value,hashedValue);