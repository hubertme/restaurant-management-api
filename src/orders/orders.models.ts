export class OrderItemList {
    menuId: number;
    quantity: number;

    constructor(
        menuId: number,
        quantity: number,
    ) {
        this.menuId = menuId;
        this.quantity = quantity;
    }

    static fromJson(json: {[key: string]: any}): OrderItemList {
        return new OrderItemList(
            json['menu_id'],
            json['quantity'],
        )
    }
}

export class CreateOrderRequest {
    refId: string;
    customerName: string;
    channel: number;
    items: OrderItemList[];
    restoId: number;

    constructor(
        customerName: string,
        channel: number,
        items: OrderItemList[],
        refId: string | null,
        restoId: number,
    ) {
        this.customerName = customerName;
        this.channel = channel;
        this.items = items;
        this.refId = refId;
        this.restoId = restoId;
    }

    static fromJson(json: {[key: string]: any}): CreateOrderRequest {
        const rawItems = json['items'];
        const items: OrderItemList[] = rawItems.map((e) => OrderItemList.fromJson(e));

        return new CreateOrderRequest(
            json['customer_name'],
            json['channel'],
            items,
            json['ref_id'],
            json['restaurant_id'],
        );
    }
}