export class MyPlan {
    id;
    destination_city;
    creation_date;
    cover;

    constructor(id, destination_city, creation_date, cover) {
        this.id = id;
        this.destination_city = destination_city;
        this.creation_date = creation_date;
        this.cover = cover;
    }
}
