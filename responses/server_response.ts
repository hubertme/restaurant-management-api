import {SuccessCodes, ErrorCodes} from './codes';

class ResponseModel {
    readonly code: string;
    readonly message: string;
    readonly data: any;

    constructor(code: string, message: string = '', data: any = null) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

export default class ServerResponse {
    // --- GENERAL
    static Success(data: any = null): ResponseModel {
        return new ResponseModel(
            SuccessCodes.OK,
            'OK',
            data
        )
    }

    static Error(errorCode: string, message: string, data: any = null): ResponseModel {
        if (message == '') {
            message = 'Undefined error code...'
        }

        return new ResponseModel(
            errorCode,
            message,
            data,
        )
    }

    // --- SPECIFIC
    static UnimplementedMethod(): ResponseModel {
        return new ResponseModel(
            ErrorCodes.UNIMPLEMENTED_METHOD,
            'Non-existent endpoint',
            null,
        )
    }

    static ValidationError(message: string = 'Please check your body payload again'): ResponseModel {
        return new ResponseModel(
            ErrorCodes.INVALID_INPUT,
            message,
            null,
        )
    }

    static GeneralError(data: any = null, message: string = 'An error occurred'): ResponseModel {
        if (data instanceof Error) {
            data = {
                error: {
                    name: data.name,
                    message: data.message,
                    stack: data.stack,
                }
            };
        }

        return new ResponseModel(
            ErrorCodes.GENERAL_ERR,
            message,
            data,
        )
    }
}