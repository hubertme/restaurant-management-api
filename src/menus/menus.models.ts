export class CreateMenuRequest {
    restoId: number;
    name: string;
    description: string;
    price: number;

    static fromJson(json: {[key: string]: any}): CreateMenuRequest {
        const base = new CreateMenuRequest();

        base.restoId = json['resto_id'];
        base.name = json['name'];
        base.description = json['description'];
        base.price = json['price'];

        return base;
    }
}