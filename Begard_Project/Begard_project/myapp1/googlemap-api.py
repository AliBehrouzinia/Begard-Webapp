import googlemaps
import pprint

#this api key must be secret
API_KEY = 'AIzaSyAIFNnz7b2JJ96a_LEAF90j4Yx2iLlCNrY'
API_KEY1 = 'AIzaSyBvEnnTzzWtSJ6nujmphmvPFXVXHMviX1I'

gmap = googlemaps.Client(key=API_KEY ,retry_over_query_limit = False)

#define a text search
#input = 'tehran+resturant'
#place_Result = googlemaps.places.find_place(gmap ,input=input ,input_type='textquery' ,fields={'name','types'})

#places = gmap.places_nearby(location='35.701922, 51.396719',radius = 1000 , type ='cafe')

place = googlemaps.places.places_nearby(gmap,location='35.710932, 51.409525',radius=10000,type='restaurant')

time.sleep(1)

Place_Result = place['results']

teh_city = City(name = "Tehran")
teh_city.save()

i=0
for Value in Place_Result:
    Restaurant.objects.create(name = Value['name'],rating = Value['rating'],photo_ref = Value['photos'][0]['photo_reference'],city = teh_city)
    print("{} Done...").format(i)
    i += 1
