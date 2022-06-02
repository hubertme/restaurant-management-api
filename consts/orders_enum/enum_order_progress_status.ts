class ErrorMessage {
    static readonly INVALID_PROGRESSION = 'err/order-progression/invalid';
    static readonly ORDER_FINISHED = 'err/order-progression/already-finished';
}

export default class EnumOrderProgressStatus {
    static readonly CANCELLED: number = 1200;

    static readonly RECEIVED = 1201;
    static readonly PREPARING = 1202;
    static readonly READY = 1203;
    static readonly FINISHED = 1204;

    static readonly PROGRESSION = [
        this.RECEIVED,
        this.PREPARING,
        this.READY,
        this.FINISHED
    ]

    /**
     * Always use this method to assign progression - for the sake of single source of truth
     * @param current 
     * @returns 
     */
    static getNextProgression(current: number): number {
        const cIdx = this.PROGRESSION.indexOf(current);
        if (cIdx === -1) {
            throw ErrorMessage.INVALID_PROGRESSION;
        } else if (cIdx === this.PROGRESSION.length - 1) {
            throw ErrorMessage.ORDER_FINISHED;
        } else {
            return this.PROGRESSION[cIdx + 1];
        }
    }
}