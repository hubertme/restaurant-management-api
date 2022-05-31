export default class EnumOrderChannel {
    static readonly OFFLINE: number = 1101;
    static readonly ONLINE_GOFOOD: number = 1102;
    static readonly ONLINE_GRABFOOD: number = 1103;
    static readonly ONLINE_OTHERS: number = 1199;

    static readonly ACCEPTED_VALUES = [
        this.OFFLINE,
        this.ONLINE_GOFOOD,
        this.ONLINE_GRABFOOD,
        this.ONLINE_OTHERS,
    ]
}