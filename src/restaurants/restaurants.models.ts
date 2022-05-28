export class CreateRestaurantRequest {
    businessName: string;
    legalName: string;
    addLine1: string;
    addLine2: string;
    subdistrict: string;
    district: string;
    city: string;
    province: string;
    latitude: number;
    longitude: number;

    static fromJson(json: {[key: string]: any}): CreateRestaurantRequest {
        const base = new CreateRestaurantRequest();

        base.businessName = json['business_name'];
        base.legalName = json['legal_name'];
        base.addLine1 = json['address_line_1'];
        base.addLine2 = json['address_line_2'];
        base.subdistrict = json['subdistrict'];
        base.district = json['district'];
        base.city = json['city'];
        base.province = json['province'];
        base.latitude = json['latitude'];
        base.longitude = json['longitude'];

        return base;
    }
}