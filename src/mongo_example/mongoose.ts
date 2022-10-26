import mongoose from "mongoose";

const establishConnection = async (connStr: string) => {
    const db = await mongoose.connect(connStr);
    console.log('connected !!')
}


establishConnection('mongodb://localhost:37017/mydb').catch(err => console.log(err));