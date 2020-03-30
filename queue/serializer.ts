export class Serializer {
    types: Array<any>;

    constructor(types) { this.types = types; }
    serialize(object) {
        let idx = this.types.findIndex((e) => { return e[Object.keys(e)[0]].name == object.constructor.name });
        if (idx == -1) throw "type  '" + object.constructor.name + "' not initialized";
        return JSON.stringify([idx, Object.entries(object)]);
    }
    deserialize(jstring) {
        let array = JSON.parse(jstring);
        let object = new new this.types[array[0]][Object.keys(this.types[array[0]])[0]]();
        array[1].map(e => { object[e[0]] = e[1]; });
        return object;
    }
}