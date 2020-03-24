export class Location{
    public name: string ;
    public lng: string;
    public lat: string;
    public id: number;
    public address: string;
    public rating: string;
    public imagePath: string;

    constructor(name: string , lng: string , lat: string , id: number, address:string,
        rating:string,imgPath:string ){
            this.name = name;
            this.lng = lng;
            this.lat = lat;
            this.id = id;
            this.address = address;
            this.rating = rating;
            this.imagePath = imgPath;

    }
}