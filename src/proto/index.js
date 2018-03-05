import protobuf from "protobufjs";
import path from "path";

// loadModels imports a file with the given packageName
// and accepts a list of strings (messages)
//
// returns an object with a protobufjs.Message class for each message listed
export async function loadModels(filepath, packageName, messages) {
    let res = {};
    let root = await protobuf.load(filepath)
    for (let msg of messages) {
        let name = packageName + "." + msg;
        res[msg] = root.lookupType(name);
    }
    return res 
}

export function pbToObj(msgClass, buffer) {
    let decodedMessage = msgClass.decode(buffer);
    return msgClass.toObject(decodedMessage, {bytes: String});
}

export function objToPB(msgClass, obj) {
    let err = msgClass.verify(obj);
    if (err) throw Error(err);

    let buffer = msgClass.encode(obj).finish();
    return buffer;
}
