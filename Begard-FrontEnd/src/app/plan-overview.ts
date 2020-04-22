export class PlanOverView {
    creation_date;
    plan_id;
    city;
    username;
    profile_image;
    cover;

    constructor(creation_date, plan_id, city, username, profile_image, cover) {
        this.creation_date = creation_date;
        this.plan_id = plan_id;
        this.city = city;
        this.username = username;
        this.profile_image = profile_image;
        this.cover = cover;
     }
}
